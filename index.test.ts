import { PromisePool } from "./index.ts";
import { assertEquals } from "https://deno.land/std@0.142.0/testing/asserts.ts";

function sleep() {
  return new Promise((resolve) => {
    setTimeout(resolve, 500);
  });
}

class Context {
  count = 0;
  max = 0;
  increment() {
    this.count += 1;
    this.max = Math.max(this.max, this.count);
  }
  decrement() {
    this.count -= 1;
  }
}
Deno.test("should run concurrency 1", async () => {
  const p = new PromisePool({ concurrency: 1 });
  const context = new Context();

  async function task() {
    context.increment();
    if (context.count > 1) throw Error("should not run");
    await sleep();
    context.decrement();
  }

  await Promise.all([
    p.open(() => task()),
    p.open(() => task()),
    p.open(() => task()),
  ]);
  assertEquals(context.max, 1);
  assertEquals(context.count, 0);
});

Deno.test("should run concurrency 2", async () => {
  const p = new PromisePool({ concurrency: 2 });

  const context = new Context();
  async function task() {
    context.increment();
    if (context.count > 2) throw Error("should not run");
    await sleep();
    context.decrement();
  }

  await Promise.all([
    p.open(() => task()),
    p.open(() => task()),
    p.open(() => task()),
    p.open(() => task()),
  ]);
  assertEquals(context.max, 2);
  assertEquals(context.count, 0);
});
