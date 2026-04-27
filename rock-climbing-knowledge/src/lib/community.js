/**
 * 社区功能 API — 帖子、评论、点赞、媒体上传
 */
import { supabase } from './supabase'

// ─── 帖子 ───────────────────────────────────────────────

/** 获取帖子列表（含作者信息和统计） */
export async function fetchPosts({ page = 1, pageSize = 20, climbingType } = {}) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id ( id, username, avatar_url, climbing_level ),
      media ( id, storage_path, media_type, display_order ),
      post_knowledge_points ( kp_id ),
      likes ( user_id ),
      comments ( id )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range((page - 1) * pageSize, page * pageSize - 1)

  if (climbingType) {
    query = query.eq('climbing_type', climbingType)
  }

  const { data, error } = await query
  return { data, error }
}

/** 获取单个帖子详情 */
export async function fetchPost(postId) {
  const { data, error } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id ( id, username, avatar_url, climbing_level, bio ),
      media ( id, storage_path, media_type, mime_type, duration_seconds, display_order ),
      post_knowledge_points ( kp_id, tagged_by ),
      likes ( user_id )
    `)
    .eq('id', postId)
    .single()
  return { data, error }
}

/** 创建帖子 */
export async function createPost({ title, description, climbingType, grade, location }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id,
      title,
      description,
      climbing_type: climbingType,
      grade,
      location,
    })
    .select()
    .single()
  return { data, error }
}

/** 删除帖子 */
export async function deletePost(postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  return { error }
}

// ─── 媒体上传 ────────────────────────────────────────────

/** 上传文件到 Storage 并在 media 表中记录 */
export async function uploadMedia(postId, file, displayOrder = 0) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const fileExt = file.name.split('.').pop()
  const filePath = `${user.id}/${postId}/${Date.now()}.${fileExt}`

  // 1. 上传到 Storage
  const { error: uploadError } = await supabase.storage
    .from('community-media')
    .upload(filePath, file)

  if (uploadError) return { error: uploadError }

  // 2. 获取公开 URL
  const { data: { publicUrl } } = supabase.storage
    .from('community-media')
    .getPublicUrl(filePath)

  // 3. 在 media 表中记录
  const mediaType = file.type.startsWith('video/') ? 'video' : 'image'
  const { data, error } = await supabase
    .from('media')
    .insert({
      post_id: postId,
      storage_path: filePath,
      media_type: mediaType,
      mime_type: file.type,
      file_size_bytes: file.size,
      display_order: displayOrder,
    })
    .select()
    .single()

  return { data: data ? { ...data, publicUrl } : null, error }
}

// ─── 评论 ───────────────────────────────────────────────

/** 获取帖子的评论列表 */
export async function fetchComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id ( id, username, avatar_url )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return { data, error }
}

/** 发表评论 */
export async function createComment(postId, content, parentCommentId = null) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const { data, error } = await supabase
    .from('comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
      parent_comment_id: parentCommentId,
    })
    .select(`
      *,
      profiles:user_id ( id, username, avatar_url )
    `)
    .single()
  return { data, error }
}

/** 删除评论 */
export async function deleteComment(commentId) {
  const { error } = await supabase.from('comments').delete().eq('id', commentId)
  return { error }
}

// ─── 点赞 ───────────────────────────────────────────────

/** 切换点赞状态（已赞则取消，未赞则添加） */
export async function toggleLike(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  // 检查是否已点赞
  const { data: existing } = await supabase
    .from('likes')
    .select('user_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .single()

  if (existing) {
    // 取消点赞
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    return { liked: false, error }
  } else {
    // 添加点赞
    const { error } = await supabase
      .from('likes')
      .insert({ user_id: user.id, post_id: postId })
    return { liked: true, error }
  }
}

// ─── 发现页静态帖子互动 ─────────────────────────────────────

/** 获取当前用户对发现页静态帖子的阅读、点赞和收藏状态 */
export async function fetchMyFeedInteractions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: { views: [], likes: [], bookmarks: [] }, error: null }

  const [viewsResult, likesResult, bookmarksResult] = await Promise.all([
    supabase
      .from('feed_views')
      .select('post_id, viewed_at')
      .eq('user_id', user.id)
      .order('viewed_at', { ascending: false }),
    supabase
      .from('feed_likes')
      .select('post_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
    supabase
      .from('feed_bookmarks')
      .select('post_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false }),
  ])

  const error = viewsResult.error || likesResult.error || bookmarksResult.error
  return {
    data: {
      views: viewsResult.data || [],
      likes: likesResult.data || [],
      bookmarks: bookmarksResult.data || [],
    },
    error,
  }
}

/** 获取当前用户在发现页的互动记录，用于“我的”页面 */
export async function fetchMyFeedActivity() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: { likes: [], bookmarks: [], comments: [] }, error: null }

  const [likesResult, bookmarksResult, commentsResult] = await Promise.all([
    supabase
      .from('feed_likes')
      .select('post_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('feed_bookmarks')
      .select('post_id, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('feed_comments')
      .select('id, post_id, content, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12),
  ])

  const error = likesResult.error || bookmarksResult.error || commentsResult.error
  return {
    data: {
      likes: likesResult.data || [],
      bookmarks: bookmarksResult.data || [],
      comments: commentsResult.data || [],
    },
    error,
  }
}

/** 获取发现页某个静态帖子的用户评论 */
export async function fetchFeedComments(postId) {
  const { data, error } = await supabase
    .from('feed_comments')
    .select(`
      id,
      post_id,
      content,
      created_at,
      profiles:user_id ( id, username, avatar_url )
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })
  return { data, error }
}

/** 记录当前用户读过某个发现页静态帖子 */
export async function recordFeedView(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: null }

  const { data, error } = await supabase
    .from('feed_views')
    .upsert(
      {
        user_id: user.id,
        post_id: postId,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,post_id' }
    )
    .select('post_id, viewed_at')
    .single()

  return { data, error }
}

/** 获取发现页静态帖子的聚合统计 */
export async function fetchFeedPostStats() {
  const { data, error } = await supabase.rpc('get_feed_post_stats')
  return { data: data || [], error }
}

/** 发表发现页静态帖子评论 */
export async function createFeedComment(postId, content) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const { data, error } = await supabase
    .from('feed_comments')
    .insert({
      post_id: postId,
      user_id: user.id,
      content,
    })
    .select(`
      id,
      post_id,
      content,
      created_at,
      profiles:user_id ( id, username, avatar_url )
    `)
    .single()
  return { data, error }
}

/** 切换发现页静态帖子点赞状态 */
export async function toggleFeedLike(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const { data: existing } = await supabase
    .from('feed_likes')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('feed_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    return { liked: false, error }
  }

  const { error } = await supabase
    .from('feed_likes')
    .insert({ user_id: user.id, post_id: postId })
  return { liked: true, error }
}

/** 切换发现页静态帖子收藏状态 */
export async function toggleFeedBookmark(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const { data: existing } = await supabase
    .from('feed_bookmarks')
    .select('post_id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from('feed_bookmarks')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', user.id)
    return { bookmarked: false, error }
  }

  const { error } = await supabase
    .from('feed_bookmarks')
    .insert({ user_id: user.id, post_id: postId })
  return { bookmarked: true, error }
}

// ─── 知识点标注 ──────────────────────────────────────────

/** 给帖子添加知识点标注 */
export async function tagKnowledgePoint(postId, kpId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: { message: '请先登录' } }

  const { data, error } = await supabase
    .from('post_knowledge_points')
    .insert({ post_id: postId, kp_id: kpId, tagged_by: user.id })
    .select()
    .single()
  return { data, error }
}

/** 移除知识点标注 */
export async function untagKnowledgePoint(postId, kpId) {
  const { error } = await supabase
    .from('post_knowledge_points')
    .delete()
    .eq('post_id', postId)
    .eq('kp_id', kpId)
  return { error }
}
