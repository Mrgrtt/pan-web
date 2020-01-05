import request from '../util/request'

export function getFiles(id) {
  return request({
    url: '/file/list/' + id,
    method: 'get'
  })
}

export function deleteFile(id) {
  return request({
    url: '/file/delete/' + id,
    method: 'post'
  })
}

export function renameFile(id, newName) {
  return request({
    url: '/file/rename/' + id,
    method: 'post',
    params: {
      newName: newName
    }
  })
}

export function moveFile(id, newCatalogId) {
  return request({
    url: '/file/move/' + id,
    method: 'post',
    params: {
      newCatalogId: newCatalogId
    }
  })
}
