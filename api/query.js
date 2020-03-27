module.exports = async (ctx) => {
  let query = {}

  if (ctx.props.range) {
    query.createdAt = {
      $gte: ctx.props.range.from,
      $lt: ctx.props.range.to
    }
  }

  const stats = await ctx.state.db.Stats.find(query)

  let dataResult = []

  if (ctx.props.targets) {
    dataResult = ctx.props.targets.map((target) => {
      const datapoints = stats.map((stat) => {
        return [
          stat[target.target],
          stat.createdAt.getTime()
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
