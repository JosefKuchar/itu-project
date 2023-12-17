import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import MenuView from '@/views/MenuView.vue'
import CreateLobbyView from '@/views/CreateLobbyView.vue'
import PlayWithFriendView from '@/views/PlayWithFriendView.vue'
import PlayPublicView from '@/views/PlayPublicView.vue'
import PlayWithAi from '@/views/PlayWithAi.vue'
import PlayLocal from '@/views/PlayLocal.vue'
import JoinGameView from '@/views/JoinGameView.vue'
import JoinFriendGameView from '@/views/JoinFriendGameView.vue'
import ResultView from '@/views/ResultView.vue'
import ReplayView from '@/views/ReplayView.vue'

import { useStore } from '@/store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
    {
      path: '/create-lobby',
      name: 'create-lobby',
      component: CreateLobbyView
    },
    {
      path: '/play-with-friend',
      name: 'play-with-friend',
      component: PlayWithFriendView
    },
    {
      path: '/play-public',
      name: 'play-public',
      component: PlayPublicView
    },
    {
      path: '/play-with-ai',
      name: 'play-with-ai',
      component: PlayWithAi
    },
    {
      path: '/',
      name: 'menu',
      component: MenuView
    },
    {
      path: '/join-game',
      name: 'join-game',
      component: JoinGameView
    },
    {
      path: '/join-friend-game/:id',
      name: 'join-friend-game',
      component: JoinFriendGameView
    },
    {
      path: '/result',
      name: 'result',
      component: ResultView
    },
    {
      path: '/replay',
      name: 'replay',
      component: ReplayView
    },
    {
      path: '/play-locally',
      name: 'play-locally',
      component: PlayLocal
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (from.name === 'join-game' && to.name !== 'game') {
    useStore().leaveMatch()
  }
  next()
})

export default router
