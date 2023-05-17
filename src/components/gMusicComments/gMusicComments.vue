<template>
  <div class="g-music-comments">
    <h4 v-html="t('gMusicComments.title')"></h4>
    <q-list>
      <template v-for="comment in comments" :key="comment._id">
        <q-item>
          <q-item-section top avatar>
            <q-avatar :size="'32px'" color="primary">
              <template v-if="comment?.avatar">
                <img :alt="comment.nickname" src="/images/icons/avatar.png" />
              </template>

              <template v-else>
                {{ avatarOrFullName(comment.nickname) }}
              </template>
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ comment.nickname }}</q-item-label>
            <q-item-label caption lines="2">
              <span v-html="comment.text"></span>
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ comment.createdAt }}</q-item-label>
            <q-item-label>
              <div
                v-if="comment.user === currentUser._id"
                class="g-link"
                @click.prevent="deleteComment(comment._id)"
              >
                {{ t('gMusicComments.buttonDeleteComment') }}
              </div>
            </q-item-label>
            <q-item-label>
              <div class="g-link" @click.prevent="toggleReply(comment._id)">
                {{ t('gMusicComments.buttonReplyComment') }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-list v-if="comment.replies && comment.replies.length">
          <q-item v-for="reply in comment.replies" :key="reply._id">
            <q-item-section top avatar>
              <q-avatar :size="'32px'" color="primary">
                <template v-if="reply?.avatar">
                  <img :alt="reply.nickname" src="/images/icons/avatar.png" />
                </template>

                <template v-else>
                  {{ avatarOrFullName(reply.nickname) }}
                </template>
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ reply.nickname }}</q-item-label>
              <q-item-label caption lines="2">
                <span v-html="reply.text"></span>
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label caption>{{ reply.createdAt }}</q-item-label>
              <q-item-label>
                <div
                  v-if="reply.user === currentUser._id"
                  class="g-link"
                  @click.prevent="deleteReply(comment._id, reply._id)"
                >
                  {{ t('gMusicComments.buttonDeleteComment') }}
                </div>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div
          v-if="isReplyOpen(comment._id)"
          class="g-music-comments__reply-actions"
        >
          <g-input
            v-model="replyText[comment._id]"
            :dense="dense"
            :placeholder="t('gMusicComments.yourComment')"
            standout
            type="textarea"
          />

          <q-btn
            :label="t('gMusicComments.buttonReplyComment')"
            :loading="isLoading"
            class="q-btn-large"
            rounded
            text-color="''"
            type="submit"
            unelevated
            @click.prevent="addReply(comment._id)"
          />
        </div>
      </template>
    </q-list>

    <div class="g-music-comments__actions">
      <g-input
        v-model="newCommentText"
        :dense="dense"
        :placeholder="t('gMusicComments.yourComment')"
        standout
        type="textarea"
      />
      <q-btn
        :label="t('gMusicComments.buttonAddComment')"
        :loading="isLoading"
        class="q-btn-large"
        rounded
        text-color="''"
        type="submit"
        unelevated
        @click.prevent="addComment"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import gInput from '@/components/gInput/gInput.vue'
import { v4 as uuid } from 'uuid'
import { User } from 'src/types/users'
import { useAuthStore } from '@/stores'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    gInput,
  },
})

interface Comment {
  _id: string
  text: string
  user?: string
  nickname?: string
  replies: Comment[]
  createdAt?: string
}

const dense = ref<boolean>(false)
const isLoading = ref<boolean>(false)
let savedComments = ref<Comment[]>([])

if (localStorage.getItem('comments')) {
  try {
    savedComments.value = JSON.parse(localStorage.getItem('comments') as string)
  } catch (error) {
    localStorage.removeItem('comments')
  }
}

const avatarOrFullName = (nickname: string) => {
  return nickname[0].toUpperCase()
}

const comments = ref<Comment[]>(
  savedComments.value._value
    ? savedComments.value._value
    : [
        {
          _id: uuid(),
          text: 'First comment',
          user: 'user1@example.com',
          nickname: 'user1',
          replies: [
            {
              _id: uuid(),
              text: 'First reply to first comment',
              user: 'user2@example.com',
              nickname: 'user2',
              replies: [],
              createdAt: new Date().toLocaleString(),
            },
          ],
          createdAt: new Date().toLocaleString(),
        },
        {
          _id: uuid(),
          text: 'Second comment',
          user: 'user2@example.com',
          nickname: 'user2',
          replies: [],
          createdAt: new Date().toLocaleString(),
        },
      ]
)

localStorage.setItem('comments', JSON.stringify(comments))

const currentUser = ref<User | undefined>(authStore?.user)
const newCommentText = ref<string>('')
const replyText = ref<{ [commentId: string]: string }>({})
const replyOpen = ref<{ [commentId: string]: boolean }>({})

const addComment = () => {
  comments.value.push({
    _id: uuid(),
    text: newCommentText.value,
    user: currentUser.value?._id,
    nickname: currentUser.value?.nickname,
    replies: [],
    createdAt: new Date().toLocaleString(),
  })
  newCommentText.value = ''
  localStorage.setItem('comments', JSON.stringify(comments))
}

const deleteComment = (commentId: string) => {
  const index = comments.value.findIndex((comment) => comment._id === commentId)
  if (index !== -1) {
    const comment = comments.value[index]
    if (comment.user === currentUser.value?._id) {
      comments.value.splice(index, 1)
      localStorage.setItem('comments', JSON.stringify(comments))
    }
  }
}

const addReply = (commentId: string) => {
  const comment = comments.value.find((comment) => comment._id === commentId)
  if (comment) {
    comment.replies.push({
      _id: uuid(),
      text: replyText.value[commentId],
      user: currentUser.value?._id,
      nickname: currentUser.value?.nickname,
      replies: [],
      createdAt: new Date().toLocaleString(),
    })
    replyText.value[commentId] = ''
    replyOpen.value[commentId] = false

    localStorage.setItem('comments', JSON.stringify(comments))
  }
}

const deleteReply = (commentId: string, replyId: string) => {
  const comment = comments.value.find((comment) => comment._id === commentId)
  if (comment) {
    const replyIndex = comment.replies.findIndex(
      (reply) => reply._id === replyId
    )
    if (replyIndex !== -1) {
      const reply = comment.replies[replyIndex]
      if (reply.user === currentUser.value?._id) {
        comment.replies.splice(replyIndex, 1)
        localStorage.setItem('comments', JSON.stringify(comment))
      }
    }
  }
}

const toggleReply = (commentId: string) => {
  replyOpen.value[commentId] = !replyOpen.value[commentId]
}

const isReplyOpen = (commentId: string) => {
  return replyOpen.value[commentId] || false
}
</script>

<style scoped></style>
