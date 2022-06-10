# promise-pool

PromisePool creates a pool that limits the number of concurrent JavaScript operations using Promise.

## how to use

```typescript
import { PromisePool } from "https://deno.land/x/promise_pool@v0.0.2/index.ts";

const pool = new PromisePool({ concurrency: 2 /* default 1 */ });

await Promise.all([
  pool.open(async () => {
    console.log("running 1")
    // some async process.
  }),
  pool.open(async () => {
    console.log("running 2")
    // some async process.
  }),
  pool.open(async () => {
    console.log("running 3")
    // some async process.
  }),
  pool.open(async () => {
    // some async process.
    console.log("running 4")
  }),
]);

console.log("done!")
```
