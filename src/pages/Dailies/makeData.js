import { faker } from "@faker-js/faker"

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

const newPerson = () => {
  return {
    firstName: faker.person.firstName(),
    lastName: Math.random() < 0.1 ? undefined : faker.person.lastName(),
    age: faker.number.int(40),
    visits: Math.random() < 0.1 ? undefined : faker.number.int(1000),
    progress: faker.number.int(100),
    createdAt: faker.date.anytime(),
    status: faker.helpers.shuffle(["relationship", "complicated", "single"])[0],
    rank: faker.number.int(100),
  }
}

export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(() => {
      return {
        ...newPerson(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

  return makeDataLevel()
}
