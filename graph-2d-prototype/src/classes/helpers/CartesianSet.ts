import _ from 'lodash'

export function cartesianProductOf(input: Array<Array<any>>) {
  return _.reduce(
    input,
    (accum: Array<Array<any>>, value: Array<any>) => {
      return _.flatten(
        _.map(accum, function (x: Array<any>) {
          return _.map(value, function (y: any) {
            return x.concat([y])
          })
        })
      )
    },
    [[]]
  )
}

export function cartesianProductOfObject(input: { [index: string]: Array<number> }): Array<any> {
  const flatObjects = _.map(Object.keys(input), (key: string) => {
    return _.reduce(
      input[key],
      (accum: Array<{ [index: string]: number }>, val: number) => {
        accum.push({ [key]: val })

        return accum
      },
      []
    )
  })

  const cartesianResult = cartesianProductOf(flatObjects)

  return _.map(cartesianResult, (data: Array<{ [index: string]: number }>) => {
    return _.merge({}, ...data)
  })
}
