import Task from 'data.task';
// Box is good at un-nesting expressions, just like composition
// replaces assignment
export const Box = x => ({
  apply: b2 => b2.map(x),
  chain: f => Box(f(x)),
  map: f => Box(f(x)),
  fold: f => f(x),
  inspect: () => `Box(${x})`,
});
Box.of = (x) => new Box(x);

export const join = m => m.chain(x => x);

export const Right = x => ({
  apply: r2 => r2.map(x),
  chain: f => f(x),
  map: f => Right(f(x)),
  fold: (f, g) => g(x),
  inspect: () => `Right(${x})`,
});
Right.of = (x) => new Right(x);

export const Left = x => ({
  apply: l2 => Left(x),
  chain: f => Left(x),
  map: f => Left(x),
  fold: (f, g) => f(x),
  inspect: () => `Left(${x})`,
});

export const Either = Right || Left;
Either.of = (x) => new Right(x);

export const fromNullable = x => (
  x != null
    ? Right(x)
    : Left(null)
);

export const eitherToTask = e => e.fold(Task.rejected, Task.of);

export const tryCatch = (f) => {
  try {
    return Right(f());
  } catch (e) {
    return Left(e);
  }
};

// semi-groups
const Sum = x => ({
  x,
  // destructure of otherSum and rename x to y.
  concat: ({x: y}) => Sum(x + y),
  inspect: () => `Sum(${x})`
});
Sum.empty = () => Sum(0);

const All = x => ({
  x,
  concat: ({x: y}) => All(x && y),
  inspect: () => `All(${x})`
});
All.empty = () => All(true);

const First = x => ({
  x,
  concat: _ => First(x),
  inspect: () => `First(${x})`
});

export const semiGroup = {
  Sum,
  All,
  First
};

const Product = x => ({
  x,
  concat: ({x: y}) => Product(x * y),
  inspect: () => `Product(${x})`
});
Product.empty = () => Product(1);

const Any = x => ({
  x,
  concat: ({x: y}) => Any(x || y),
  inspect: () => `Any(${x})`
});
Any.empty = () => Any(false);

const Max = x => ({
  x,
  concat: ({x: y}) => x > y ? Max(x) : Max(y),
  inspect: () => `Max(${x})`
});
Max.empty = () => Max(-Infinity);

const Min = x => ({
  x,
  concat: ({x: y}) => x < y ? Min(x) : Min(y),
  inspect: () => `Min(${x})`
});
Min.empty = () => Min(Infinity);

const monoidFirst = either => ({
  fold: f => f(either),
  concat: o => either.isLeft
    ? o
    : First(either)
});
monoidFirst.empty = () => monoidFirst(Left());

const Fn = f => ({
  fold: f,
  concat: o =>
    Fn(x => f(x).concat(o.fold(x)))
});

export const monoids = {
  All,
  Any,
  First: monoidFirst,
  Max,
  Min,
  Product,
  Sum,
};

export const sum = xs =>
  xs.reduce((acc, x) => acc + x, 0);

export const all = xs =>
  xs.reduce((acc, x) => acc && x, true);

export const first = xs =>
  xs.reduce((acc, x) => acc);


export const identity = (x) => x;
export const noOp = () => {};
export const debugLog = result => {
  console.log('----start-----');
  console.log(result);
  console.log('-----end------');
  return result;
};
