# asteroids
A p2p asteroids multiplayer remake

## for Devs
1. Execute the following commands in the folder `/asteroidsClient/www/lib`

TODO: outdated

 ```
 $ npm install
 $ grunt
 ```
2. Edit the TS compile error in
`/asteroidsClient/www/lib/node_modules/phaser/typescript/phaser.comments.d.ts`
by adding a `: void` as a return value to the problematic code line.
