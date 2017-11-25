
 From course
 https://egghead.io/lessons/javascript-composable-code-branching-with-either
 
 
 fold -> removal from a type
 foldMap -> combined map reduce
 
Functor - any type with a map method
* laws:
  * Preserve function composition
    * `fx.map(f).map(g) == fx.map(x => g(f(x))`

Monadic interface
 * .of - lifting a value into our type
 * .chain (or flatMap, bind, >>= )

Natural Transformation

`       map(f)`
`F(a) - - - - -> F(b)`
`    |         |`
` nt |         | nt`
`    |         |`
`G(a) - - - - -> G(b)`
`       map(f)`

