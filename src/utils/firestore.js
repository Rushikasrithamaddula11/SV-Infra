// Generic reusable Firestore CRUD helpers used across the whole admin panel
// and public site. Keeping this generic means new content types (a new
// "collection") can be added without writing new database code.
import {
  collection, doc, addDoc, updateDoc, deleteDoc, getDoc, getDocs,
  query, where, orderBy, onSnapshot, serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase/config'

export const colRef = (name) => collection(db, name)

export async function listAll(colName, { activeOnly = false, orderField = 'order', direction = 'asc' } = {}) {
  let q = query(colRef(colName), orderBy(orderField, direction))
  if (activeOnly) {
    q = query(colRef(colName), where('active', '==', true), orderBy(orderField, direction))
  }
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export function subscribeAll(colName, cb, { orderField = 'order', direction = 'asc' } = {}) {
  const q = query(colRef(colName), orderBy(orderField, direction))
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
  })
}

export async function getOne(colName, id) {
  const snap = await getDoc(doc(db, colName, id))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export async function getBySlug(colName, slug) {
  const q = query(colRef(colName), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (snap.empty) return null
  const d = snap.docs[0]
  return { id: d.id, ...d.data() }
}

export async function getByField(colName, field, value) {
  const q = query(colRef(colName), where(field, '==', value))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function createDoc(colName, data) {
  const ref = await addDoc(colRef(colName), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  return ref.id
}

export async function updateDocById(colName, id, data) {
  await updateDoc(doc(db, colName, id), { ...data, updatedAt: serverTimestamp() })
}

export async function deleteDocById(colName, id) {
  await deleteDoc(doc(db, colName, id))
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
