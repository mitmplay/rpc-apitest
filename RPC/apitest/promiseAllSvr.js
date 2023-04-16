async function promiseAllSvr() {
  const {apidemo} = rpc()
  try {
    const all = await Promise.all([
      apidemo.demo_add({ value: 1 }),
      apidemo.demo_add({ value: 1 }),
      apidemo.demo_add({ value: 1 }),
    ])
    console.log(`Got data: ${JSON.stringify(all)}`)
    return all
  } catch (error) {
    console.error(`Error getting data:`, error)
    return error
  }
}
module.exports = promiseAllSvr