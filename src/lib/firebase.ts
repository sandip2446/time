import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyBsrz-ticRdoWaYSBTsDyQSShtNR6xhHdc',
  authDomain: 'utility-1153c.firebaseapp.com',
  projectId: 'utility-1153c',
  storageBucket: 'utility-1153c.firebasestorage.app',
  messagingSenderId: '931529080135',
  appId: '1:931529080135:web:68ba754b402dd24e0ba062',
  measurementId: 'G-E3Q3EF1FS9',
}

export const app = initializeApp(firebaseConfig)

let analytics: Analytics | null = null

export async function initAnalytics() {
  if (analytics) return analytics
  if (typeof window === 'undefined') return null
  if (!(await isSupported())) return null
  analytics = getAnalytics(app)
  return analytics
}
