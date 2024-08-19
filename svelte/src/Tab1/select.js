export function select(e, json) {
  const {logs} = json
  for (const id in logs) {
    logs[id].chkLog = true
  }
  console.log(logs)
}