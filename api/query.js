const moment = require('moment')

module.exports = async (ctx) => {
  let query = {}

  if (ctx.props.range) {
    query.date = {
      $gte: moment.utc(ctx.props.range.from).add(1, 'hours'),
      $lte: moment.utc(ctx.props.range.to).add(1, 'hours')
    }
  }

  const stats = await ctx.state.db.Stats.find(query)

  let dataResult = []

  if (ctx.props.targets) {
    dataResult = ctx.props.targets.map((target) => {
      const datapoints = stats.map((stat) => {
        return [
          stat[target.target],
          stat.date.getTime()
        ]
      })

      return {
        target: target.target,
        datapoints
      }
    })
  }

  ctx.result = dataResult
}
