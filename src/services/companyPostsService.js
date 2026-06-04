import api from "../api";

// create a post (company only)
export async function createPost(data) {
  return api.post('company-posts', data);
}

// get posts by specific company
export async function getPostsByCompany(companyId) {
  return api.get(`company-posts/company/${companyId}`);
}

// update a post
export async function updatePost(postId, data) {
  return api.put(`company-posts/${postId}`, data);
}

// delete a post
export async function deletePost(postId) {
  return api.delete(`company-posts/${postId}`);
}

// like a post
export async function likePost(postId) {
  return api.post('company-posts/like', { postId });
}

// unlike a post
export async function unlikePost(postId) {
  return api.post('company-posts/unlike', { postId });
}

// comment on a post
export async function commentOnPost(postId, text) {
  return api.post('company-posts/comment', { postId, text });
}

// delete own comment or post owner deletes comment
export async function deleteComment(postId, commentId) {
  return api.delete('company-posts/comment', { data: { postId, commentId } });
}

// save post
export async function savePost(postId) {
  return api.post('company-posts/save', { postId });
}

// unsave post
export async function unsavePost(postId) {
  return api.delete('company-posts/save', { data: { postId } });
}

// get recommended and followed posts feed
export async function getFeed(sortBy) {
  return api.get('company-posts/feed', { params: { sortBy } });
}
