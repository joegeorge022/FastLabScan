import { ValueOf } from "next/dist/shared/lib/constants";
import React from "react";

export type QRReturn = {
    regNo: string,
    time: number
  }
  
export interface RowData extends QRReturn {
    name: string,
    dept: string,
}

export type User = {
  name :  string,
  dprt :  typeof DprtType[keyof typeof DprtType],
  email : string,
  workplace : typeof DprtType[keyof typeof DprtType],
}

export type Attendence = {
  dprt: typeof DprtType[keyof typeof DprtType],
  total: number,
  present: number,
  time: string,
  date: string,
}

export type Students = {
  name: string,
  regNo: string,
}

export type Deprtments = 'AD' | 'CSE' | 'EEE' | 'ECS' | 'CYB' | 'CE' | 'ECE' | 'ME' | 'EI'

export const deprtments = [
  'AD', 'CSE', 'EEE', 'ECS', 'CYB', 'CE', 'ECE', 'ME', 'EI'
]

const DprtType = createEnumFromArray(deprtments);



function createEnumFromArray<T extends string>(arr: T[]): { [K in T]: K } {
  const enumObject = {} as { [K in T]: K };
  arr.forEach((value) => {
    enumObject[value] = value;
  });
  return enumObject;
}


// interface form {
//   preventDefault: () => void,
//   target: {
//     [T: string] : { 
//       value : string
//     }
//   }
// }

// type pp = 'email' | 'name'

// let x:form = {
//   preventDefault: () => {},
  
//   target: {
//     name: { value: 'a' },
//     name1: { value: 'a' },
//     email: { value: 'a' },
//     // help: () => void(0),
//   }
// }



// const formElement = ['email', 'name', 'password'];

// function form (...arr : string[]){

//   let target = {
//     reset: () => void(0),
//   }
//   arr.forEach((key) => target[key] = { value: key })

//   return {
//     preventDefault: () => {},
//     target
//   }
  
// }

// const e = form(...formElement)

// import { SyntheticEvent } from "react"

//     type target = { value : string }
    

// const A = ['email', 'name', 'password']
// export type formTarget  = SyntheticEvent["target"] & {
//   [T in ValueOf A] : target
// } 