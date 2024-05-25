import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
	apiKey: "AIzaSyDow6xkdlNHGMVaqQ6T4oZG5fzxzi4nPMo",
	authDomain: "markadv-bede0.firebaseapp.com",
	projectId: "markadv-bede0",
	storageBucket: "markadv-bede0.appspot.com",
	messagingSenderId: "325551699586",
	appId: "1:325551699586:web:e501a7484f42229609669b"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

export const addBookToFirestore = async (book) => {
	try {
		const docRef = await addDoc(collection(firestore, 'books'), book);
		return docRef.id;
	} catch (error) {
		throw new Error('Error adding book to Firestore: ' + error.message);
	}
};

export const updateBookInFirestore = async (bookId, updatedBook) => {
	try {
		const bookRef = doc(firestore, 'books', bookId);
		await updateDoc(bookRef, updatedBook);
	} catch (error) {
		throw new Error('Error updating book in Firestore: ' + error.message);
	}
};

export const uploadImageAndGetURL = async (imageFile) => {
	try {
		const storageRef = ref(storage, `book-images/${imageFile.name}`);
		const snapshot = await uploadBytes(storageRef, imageFile);
		const downloadURL = await getDownloadURL(snapshot.ref);
		return downloadURL;
	} catch (error) {
		throw new Error('Error uploading image: ' + error.message);
	}
};

export const fetchBooksFromFirestore = async () => {
	try {
		const querySnapshot = await getDocs(collection(firestore, 'books'));
		return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	} catch (error) {
		throw new Error('Error fetching books from Firestore: ' + error.message);
	}
};
