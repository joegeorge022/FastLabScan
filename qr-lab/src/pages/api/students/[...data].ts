import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string,
  reg: string,
}


const students: Data[] = [
    { name: 'Rajat Sandeep Sen', reg: '21/AD/051' },
    { name: 'John Doe1', reg: '21/AD/001' },
    { name: 'John Doe2', reg: '21/AD/002' },
    { name: 'John Doe3', reg: '21/AD/003' },
    { name: 'John Doe4', reg: '21/AD/004' },
    { name: 'John Doe5', reg: '21/AD/005' },
    { name: 'John Doe6', reg: '21/AD/006' },
]

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse < Data | Error >
) {

    const { data } = req.query

    data?.length !== 3 
                  && res.status(400).json(new Error('Bad Request'))


    const [year, dept, rollNo] = data as string[]
    let id = `${year}/${dept}/${rollNo}`

    const filtered = students.find((entry) => entry.reg === id)

    filtered? res.status(200).json(filtered) 
            : res.status(404).json(new Error('Not Found'))

}