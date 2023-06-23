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
            <q-item-label v-if="currentUser">
              <div
                v-if="comment.user === currentUser?._id"
                class="g-link"
                @click.prevent="deleteComment(comment._id)"
              >
                {{ t('gMusicComments.buttonDeleteComment') }}
              </div>
            </q-item-label>
            <q-item-label v-if="currentUser">
              <div class="g-link" @click.prevent="toggleReply(comment._id)">
                {{ t('gMusicComments.buttonReplyComment') }}
              </div>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-list v-if="comment.replies && comment.replies.length">
          <template v-for="reply in comment.replies" :key="reply._id">
            <q-item>
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
                <q-item-label v-if="currentUser">
                  <div
                    v-if="reply.user === currentUser?._id"
                    class="g-link"
                    @click.prevent="deleteComment(reply._id, comment._id)"
                  >
                    {{ t('gMusicComments.buttonDeleteComment') }}
                  </div>
                </q-item-label>
                <q-item-label v-if="currentUser">
                  <div
                    class="g-link"
                    @click.prevent="toggleReply(reply._id, comment._id)"
                  >
                    {{ t('gMusicComments.buttonReplyComment') }}
                  </div>
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-list>
              <q-item
                v-for="replyToReply in reply.replies"
                :key="replyToReply._id"
              >
                <q-item-section top avatar>
                  <q-avatar :size="'32px'" color="primary">
                    <template v-if="replyToReply?.avatar">
                      <img
                        :alt="replyToReply.nickname"
                        src="/images/icons/avatar.png"
                      />
                    </template>

                    <template v-else>
                      {{ avatarOrFullName(replyToReply.nickname) }}
                    </template>
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label>{{ replyToReply.nickname }}</q-item-label>
                  <q-item-label caption lines="2">
                    <span v-html="replyToReply.text"></span>
                  </q-item-label>
                </q-item-section>

                <q-item-section side top>
                  <q-item-label caption
                    >{{ replyToReply.createdAt }}
                  </q-item-label>
                  <q-item-label v-if="currentUser">
                    <div
                      v-if="replyToReply.user === currentUser?._id"
                      class="g-link"
                      @click.prevent="
                        deleteComment(replyToReply._id, reply._id, comment._id)
                      "
                    >
                      {{ t('gMusicComments.buttonDeleteComment') }}
                    </div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <q-form v-if="replyOpen[reply._id]">
              <g-input
                ref="replyInput"
                v-model="replyText[reply._id]"
                :placeholder="t('gMusicComments.placeholderReplyComment')"
                autofocus
                standout
              />
              <q-card-actions>
                <q-btn
                  :label="t('gMusicComments.buttonReplyComment')"
                  :loading="isLoading"
                  class="q-btn-large full-width"
                  rounded
                  text-color="''"
                  type="submit"
                  unelevated
                  @click.prevent="addReplyToReply(comment._id, reply._id)"
                />

                <q-btn
                  :label="t('gMusicComments.buttonCancelComment')"
                  :loading="isLoading"
                  class="q-btn-large q-btn--light-primary full-width"
                  rounded
                  text-color="''"
                  type="submit"
                  unelevated
                  @click.prevent="replyOpen[reply._id] = false"
                />
              </q-card-actions>
            </q-form>
          </template>
        </q-list>

        <q-form v-if="replyOpen[comment._id]">
          <g-input
            ref="replyInput"
            v-model="replyText[comment._id]"
            :placeholder="t('gMusicComments.placeholderReplyComment')"
            autofocus
            standout
          />
          <q-card-actions v-if="currentUser">
            <q-btn
              :label="t('gMusicComments.buttonReplyComment')"
              :loading="isLoading"
              class="q-btn-large full-width"
              rounded
              text-color="''"
              type="submit"
              unelevated
              @click.prevent="addReply(comment._id)"
            />

            <q-btn
              :label="t('gMusicComments.buttonCancelComment')"
              :loading="isLoading"
              class="q-btn-large q-btn--light-primary full-width"
              rounded
              text-color="''"
              type="submit"
              unelevated
              @click.prevent="replyOpen[comment._id] = false"
            />
          </q-card-actions>
        </q-form>
      </template>
    </q-list>

    <div v-if="currentUser" class="g-music-comments__actions">
      <g-input
        v-model="newCommentText"
        :dense="dense"
        :placeholder="t('gMusicComments.yourComment')"
        standout
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
    <div v-else class="g-music-comments__need-login">
      <q-card class="g-music-comments__card">
        <q-card-section>
          <div class="g-music-comments__card-picture">
            <DynamicIcon name="signin" :size="32" />
          </div>

          <div class="g-music-comments__card-info">
            <router-link class="g-link" to="/login">
              {{ t('gMusicComments.signIn') }}
            </router-link>
            {{ t('gMusicComments.signInLeave') }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue'
import gInput from '@/components/gInput/gInput.vue'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { v4 as uuid } from 'uuid'
import { User } from 'src/types/users'
import { useAuthStore } from '@/stores'
import { useTranslation } from '@/composables/lang'

const { t } = useTranslation()
const authStore = useAuthStore()

defineComponent({
  components: {
    gInput,
    DynamicIcon,
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

const deleteComment = (
  commentId: string,
  parentId?: string,
  grandparentId?: string
) => {
  if (!parentId) {
    const index = comments.value.findIndex((c) => c._id === commentId)
    if (index !== -1) {
      comments.value.splice(index, 1)
      localStorage.setItem('comments', JSON.stringify(comments))
    }
  } else if (!grandparentId) {
    const parent = findCommentById(parentId)
    if (parent) {
      const index = parent.replies.findIndex(
        (c: { _id: string }) => c._id === commentId
      )
      if (index !== -1) {
        parent.replies.splice(index, 1)
        localStorage.setItem('comments', JSON.stringify(comments))
      }
    }
  } else {
    const grandparent = findCommentById(grandparentId)
    if (grandparent) {
      const parent = findCommentById(parentId, grandparent.replies)
      if (parent) {
        const index = parent.replies.findIndex(
          (c: { _id: string }) => c._id === commentId
        )
        if (index !== -1) {
          parent.replies.splice(index, 1)
          localStorage.setItem('comments', JSON.stringify(comments))
        }
      }
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

const toggleReply = (commentId: string) => {
  replyOpen.value[commentId] = !replyOpen.value[commentId]
}

const addReplyToReply = (commentId: string, replyId: string) => {
  const comment = findCommentById(commentId)
  if (comment) {
    const reply = findCommentById(replyId, comment.replies)
    if (reply) {
      reply.replies.push({
        _id: uuid(),
        text: replyText.value[replyId],
        user: currentUser.value?._id,
        nickname: currentUser.value?.nickname,
        replies: [],
        createdAt: new Date().toLocaleString(),
      })
      replyText.value[replyId] = ''
      replyOpen.value[replyId] = false

      localStorage.setItem('comments', JSON.stringify(comments))
    }
  }
}

const findCommentById = (
  commentId: string,
  commentsArr: Comment[] = comments.value
) => {
  for (const comment of commentsArr) {
    if (comment._id === commentId) {
      return comment
    }
    const result: any = findCommentById(commentId, comment.replies)
    if (result) {
      return result
    }
  }
  return null
}
</script>

<style scoped></style>
