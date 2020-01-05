import request from '../util/request'

export function getCatalogs(id) {
  return request({
    url: '/catalog/list/' + id,
    method: 'get',
  })
}

export function deleteCatalog(id) {
  return request({
    url: '/catalog/delete/' + id,
    method: 'post'
  })
}

export function addCatalog(parentId, name) {
  return request({
    url: '/catalog/create',
    method: 'post',
    params: {
      parentId: parentId,
      name: name
    }
  })
}

export function renameCatalog(id, newName) {
  return request({
    url: '/catalog/rename/' + id,
    method: 'post',
    params: {
      newName: newName
    }
  })
}

export function moveCatalog(id, newParentId) {
  return request({
    url: '/catalog/move/' + id,
    method: 'post',
    params: {
      newParentId: newParentId
    }
  })
}
