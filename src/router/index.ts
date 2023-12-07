import { createRouter, createWebHistory } from 'vue-router'
import GameView from '../views/GameView.vue'
import MenuView from '@/views/MenuView.vue'
import CreateLobbyView from '@/views/CreateLobbyView.vue'
import PlayWithFriendView from '@/views/PlayWithFriendView.vue'
import PlayPublicView from '@/views/PlayPublicView.vue'
import PlayWithAi from '@/views/PlayWithAi.vue'
import JoinGameView from '@/views/JoinGameView.vue'

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
      component: CreateLobbyView,
    },
    {
      path: '/play-with-friend',
      name: 'play-with-friend',
      component: PlayWithFriendView,
    },
    {
      path: '/play-public',
      name: 'play-public',
      component: PlayPublicView,
    },
    {
      path: '/play-with-ai',
      name: 'play-with-ai',
      component: PlayWithAi
    },
    {
      path: '/',
      name: 'menu',
      component: MenuView,
    },
    {
      path: '/join-game',
      name: 'join-game',
      component: JoinGameView,
    }
  ]
})

export default router
