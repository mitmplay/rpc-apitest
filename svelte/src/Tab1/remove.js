export async function remove(e, json) {
  const arr = []
  const {logs} = json
  for (const id in logs) {
    logs[id].chkLog && arr.push(logs[id].id)
  }
  console.log('Tobe remove:', arr)
  await window.RPC.api.remove(arr)
  return await window.RPC.api.peek(15)
}