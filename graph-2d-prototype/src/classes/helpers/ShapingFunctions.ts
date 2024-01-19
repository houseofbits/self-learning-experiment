//https://www.flong.com/archive/texts/code/shapers_exp/index.html
export default class ShapingFunctions {
  static doubleExponentialSeat(x: number, a: number): number {
    const epsilon = 0.00001
    const min_param_a = 0.0 + epsilon
    const max_param_a = 1.0 - epsilon
    a = Math.min(max_param_a, Math.max(min_param_a, a))

    let y = 0
    if (x <= 0.5) {
      y = Math.pow(2.0 * x, 1 - a) / 2.0
    } else {
      y = 1.0 - Math.pow(2.0 * (1.0 - x), 1 - a) / 2.0
    }

    return y
  }

  static doubleExponentialSigmoid(x: number, a: number): number {
    const epsilon = 0.00001
    const min_param_a = 0.0 + epsilon
    const max_param_a = 1.0 - epsilon
    a = Math.min(max_param_a, Math.max(min_param_a, a))
    a = 1.0 - a // for sensible results

    let y = 0
    if (x <= 0.5) {
      y = Math.pow(2.0 * x, 1.0 / a) / 2.0
    } else {
      y = 1.0 - Math.pow(2.0 * (1.0 - x), 1.0 / a) / 2.0
    }

    return y
  }

  static logisticSigmoid(x: number, a: number): number {
    // n.b.: this Logistic Sigmoid has been normalized.

    const epsilon = 0.0001
    const min_param_a = 0.0 + epsilon
    const max_param_a = 1.0 - epsilon
    a = Math.max(min_param_a, Math.min(max_param_a, a))
    a = 1 / (1 - a) - 1

    const A = 1.0 / (1.0 + Math.exp(0 - (x - 0.5) * a * 2.0))
    const B = 1.0 / (1.0 + Math.exp(a))
    const C = 1.0 / (1.0 + Math.exp(0 - a))
    const y = (A - B) / (C - B)

    return y
  }

  static exponentialEasing(x: number, a: number): number {
    const epsilon = 0.00001
    const min_param_a = 0.0 + epsilon
    const max_param_a = 1.0 - epsilon
    a = Math.max(min_param_a, Math.min(max_param_a, a))

    if (a < 0.5) {
      // emphasis
      a = 2.0 * a
      const y = Math.pow(x, a)

      return y
    } else {
      // de-emphasis
      a = 2.0 * (a - 0.5)
      const y = Math.pow(x, 1.0 / (1 - a))

      return y
    }
  }
}
