

import Nedb, { Cursor, CursorCount, UpdateOptions, RemoveOptions } from 'nedb'
import { promisify } from 'util'


export interface Document {
  _id: string,
}

type Query = Record<string, any>
type UpdateQuery = Query // same for now
// just good to refer to them differently if they change

type Projection = Record<string, number>

type OneOrMany<T> = T | T[]


export const createNedbPromisified = <D extends Document> (filename: string) => {
  // create an nedb instance and open the file:
  const dbOriginal = new Nedb<D>({
    filename,
    autoload: true,
  })
  
  // _id is optional when inserting:
  type InsertD = D | Omit<D, '_id'>
  
  const boundToDb = (method: string) => dbOriginal[method].bind(dbOriginal)
  const promisifyBind = (method: string) => promisify(boundToDb(method))
  
  return {
    insert: promisifyBind('insert') as
      <T extends OneOrMany<InsertD>>(newDocs: T) => Promise<T extends InsertD ? D : D[]>,
    
    count: promisifyBind('count') as
      (query: Query) => Promise<number>,
    countCursor: boundToDb('count') as
      (query: Query) => CursorCount,
    
    // If you're giving a projection, the result will be a different type than D;
    // you know more about what type the result will be than the function does,
    // so it makes more sense for you to give that type (ProjectedD); if you
    // don't give that type, it will be D by default
    find: promisifyBind('find') as
                      (query: Query)                         => Promise<D[]>,
    findProjected: promisifyBind('find') as
      <ProjectedD = D>(query: Query, projection: Projection) => Promise<ProjectedD[]>,
    // is this one even needed? do you ever use count with a cursor?
    findCursor: boundToDb('find') as
                      (query: Query)                         => Cursor<D>,
    findCursorProjected: boundToDb('find') as
      <ProjectedD = D>(query: Query, projection: Projection) => Cursor<ProjectedD>,
    
    findOne: promisifyBind('findOne') as
                      (query: Query)                         => Promise<D>,
    findOneProjected: promisifyBind('findOne') as
      <ProjectedD = D>(query: Query, projection: Projection) => Promise<ProjectedD>,
    // should findOne have a cursor version?? unclear
    // findOneCursor: boundToDb('findOne') as
    //                   (query: Query)                         => Cursor<D>,
    // findOneCursorProjected: boundToDb('findOne') as
    //   <ProjectedD = D>(query: Query, projection: Projection) => Cursor<ProjectedD>,
    
    // TODO pretty sure promisify won't work for update because its callback
    // accepts multiple arguments after the error; need to write my own
    // promisify for this
    update: promisifyBind('update') as
      (query: Query, updateQuery: UpdateQuery, options?: UpdateOptions) => Promise<number>,
    
    remove: promisifyBind('remove') as
      (query: Query, options?: RemoveOptions) => Promise<number>,
    
    
    // instead of calling a cursor's .exec() method, call this on the cursor
    // you can still call a cursor's sort, limit, etc methods
    // a cursor could be of some custom ProjectedD type, called T here
    execCursor: <T = D>(cursor: Cursor<T>): Promise<T[]> =>
      promisify(cursor.exec.bind(cursor))(),
    // is this one even needed? do you ever use count with a cursor?
    execCursorCount: (cursor: CursorCount): Promise<number> =>
      promisify(cursor.exec.bind(cursor))(),
    
    // access to the original db instance:
    _original: dbOriginal,
  }
  
  
}

export type DB = ReturnType<typeof createNedbPromisified>


