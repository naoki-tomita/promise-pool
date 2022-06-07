type AsyncTask<T = void> = () => Promise<T>;
type Task<T> = AsyncTask<T>;
type DispatchableTask<T = any> = Task<T> & { onComplete: (result: T) => void; onError: (error: Error) => void; };

export class PromisePool {
  queue: DispatchableTask[] = [];
  current: DispatchableTask[] = [];
  onEmpty?: () => void;
  onAdd?: () => void;

  constructor(readonly option: {
    concurrency?: number;
  } = {}) {}

  open<T>(task: Task<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      (task as DispatchableTask).onComplete = resolve;
      (task as DispatchableTask).onError = reject;
      this.queue.push(task as DispatchableTask);
      this.onAdd?.();
      this.run();
    });
  }

  run() {
    while (this.current.length < (this.option.concurrency ?? 1) && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        this.current.push(task);
        task()
          .then((result) => {
            this.current.splice(this.current.indexOf(task), 1);
            if ((this.current.length + this.queue.length) === 0) {
              this.onEmpty?.();
            }
            task.onComplete(result);
            this.run();
          })
          .catch((error) => {
            this.current.splice(this.current.indexOf(task), 1);
            if ((this.current.length + this.queue.length) === 0) {
              this.onEmpty?.();
            }
            task.onError(error);
            this.run();
          })
      }
    }
  }
}
