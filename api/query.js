const moment = require('moment')

module.exports = async (ctx) => {
  let query = {}

  if (ctx.props.range) {
    query.date = {
      $gte: moment.utc(ctx.props.range.from),
      $lte: moment.utc(ctx.props.range.to)
    }
  }

  const stats = await ctx.state.db.Stats.find(query)

  let dataResult = []

  if (ctx.props.targets) {
    dataResult = ctx.props.targets.map((target) => {
      const datapoints = []

      let lastPoint = 0
      let lastDate = 0
      let lastDateUnix = 0

      stats.forEach((stat) => {
        const date = Math.ceil(Math.round(stat.date.getTime() / 1000) / Math.round(stats.length / 200))

        if (lastDate !== date && lastPoint !== 0) {
          datapoints.push([
            lastPoint,
            lastDateUnix
          ])
          lastPoint = 0
          lastDate = date
          lastDateUnix = 0
        } else {
          if (lastDateUnix === 0) lastDateUnix = stat.date.getTime()
          lastPoint += stat[target.target]
        }
      })

      return {
        target: target.target,
        datapoints
      }
    })
  }

  ctx.result = dataResult
}
