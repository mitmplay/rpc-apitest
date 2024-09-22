async function test(value=10) {
  const as1 = RPC.api.fetch('restful-api/a_list_all_object')
  const as2 = RPC.api.fetch('restful-api/b_objects_by_ids')
  const as3 = RPC.api.fetch('restful-api/c_single_object')
  const as4 = RPC.api.fetch('restful-api/d_add_object')
  const as5 = RPC.api.fetch('restful-api/e_update_object')
  const as6 = RPC.api.fetch('restful-api/f_partial_update')
  const as7 = RPC.api.fetch('restful-api/g_delete_object')
  const arr = Promise.all([as1,as2,as3,as4,as5,as6,as7])
  return arr
}
module.exports = test