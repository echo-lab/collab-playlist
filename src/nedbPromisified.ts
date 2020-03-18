

import Nedb, { Cursor, CursorCount, UpdateOptions, RemoveOptions } from 'nedb'
import util from 'util'



// // nedb uses callbacks instead of promises
// // these are the methods to be promisified:
// const promiseMethods = [
//   'find',
//   'findOne',
//   'count',
//   'insert',
//   'update',
// ] as const
// // type PromiseMethods = typeof promiseMethods[number]

// // these methods can be used without a callback to return a cursor, so we
// // want to keep a non-promisified version of them:
// const cursorMethods = [
//   'find',
//   'count',
// ] as const
// // const cursorMethodsNewNames = [
// //   'findCursor',
// //   'countCursor',
// // ] as const


// type f = Parameters<Datastore['find']>
// type NedbPromisified = {
//   [method in typeof promiseMethods[number]]:
//     (...args: Parameters<Datastore[method]>[]) => Promise<any>;
// } & {
//   cursor: {
//     [method2 in typeof cursorMethods[number]]: (...args) => Promise<any>
//   }
// }


export const createNedbPromisified = <D> (filename: string) => {
  // create an nedb instance and open the file:
  const dbOriginal = new Nedb<D>({
    filename,
    autoload: true,
  })
  
  const boundToDb = (method: string) => dbOriginal[method].bind(dbOriginal)
  const promisifyBind = (method: string) => util.promisify(boundToDb(method))
  
  return {
    insert: promisifyBind('insert') as
        <T extends D | D[]>(newDocs: T) => Promise<T>,
    
    count: promisifyBind('count') as
        (query: D) => Promise<number>,
    countCursor: boundToDb('count') as
        (query: D) => CursorCount,
    
    find: promisifyBind('find') as
        (query: D, projection?: D) => Promise<D[]>,
    // is this one even needed? do you ever use count with a cursor?
    findCursor: boundToDb('find') as
        (query: D, projection?: D) => Cursor<D>,
    
    findOne: promisifyBind('findOne') as
        (query: D, projection?: D) => Promise<D>,
    // should findOne have a cursor version?? unclear
    // findOneCursor: boundToDb('findOne') as
    //     (query: D, projection?: D) => Cursor<D>,
    
    // TODO pretty sure promisify won't work for update because its callback
    // accepts multiple arguments after the error; need to write my own
    // promisify for this
    update: promisifyBind('update') as
        (query: D, updateQuery: any, options?: UpdateOptions) => Promise<number>,
    
    remove: promisifyBind('remove') as
        (query: D, options?: RemoveOptions) => Promise<number>,
    
    
    // instead of calling a cursor's .exec() method, call this on the cursor
    // you can still call a cursor's sort, limit, etc methods
    execCursor: (cursor: Cursor<D>): Promise<D[]> =>
        util.promisify(cursor.exec.bind(cursor))(),
    // is this one even needed? do you ever use count with a cursor?
    execCursorCount: (cursor: CursorCount): Promise<number> =>
        util.promisify(cursor.exec.bind(cursor))(),
    
    // access to the original db instance:
    _original: dbOriginal,
  }
  
  
  
  // // this is like a python dictionary comprehension:
  // return Object.assign(
  //   { },
  //   ...promiseMethods.map(method => ({
  //     // for each method, create a promisified version and bind 'this' variable
  //     [method]: util.promisify(dbCallback[method].bind(dbCallback))
  //   })),
  //   ...cursorMethods.map(method => ({
  //     // keep a direct reference to these methods under a different name
  //     [`${method}Cursor`]: dbCallback[method].bind(dbCallback)
  //   }))
  // ) as NedbPromisified
}



