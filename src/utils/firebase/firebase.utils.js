import { initializeApp } from 'firebase/app'; 
import { getAuth, 
        signInWithRedirect, 
        signInWithPopup, 
        GoogleAuthProvider,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        onAuthStateChanged,
    } from 'firebase/auth';

import { getFirestore,
     doc,
    getDoc,
    setDoc,
    collection,
    writeBatch,
    query,
    getDocs
     } from 'firebase/firestore';



    const firebaseConfig = {
        apiKey: "AIzaSyAeiat00Ey-94tIi47Sz-nwEHrv9Ehhxtg",
        authDomain: "dapperdash-eac6d.firebaseapp.com",
        projectId: "dapperdash-eac6d",
        storageBucket: "dapperdash-eac6d.appspot.com",
        messagingSenderId: "98672306566",
        appId: "1:98672306566:web:6b287aa0edfaa18afb6407"
    };
  
  
  const firebaseApp = initializeApp(firebaseConfig);

  const googleProvider = new GoogleAuthProvider();

        googleProvider.setCustomParameters({
        prompt: "select_account",
         });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, googleProvider);

  export const db = getFirestore();

 export const addCollectionAndDocuments = async (collectionKey, objectsToAdd) => {
    const collectionRef = collection(db,collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
        const docRef = doc(collectionRef, object.title.toLowerCase());
        batch.set(docRef,object);
    });

    await batch.commit();
    console.log('done');
 };

 export const getCategoriesAndDocumengts = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query (collectionRef);

    const querySnapShot  = await getDocs(q);
    const categoryMap = querySnapShot.docs.reduce((acc, docSnapShot) => {
        const { title, items} = docSnapShot.data();
        acc[title.toLowerCase()] = items;
        return acc;
    },{});

    return categoryMap;
 }



  export const  createUserDocumentFromAuth = 
  async (
    userAuth, 
    additionalInformartion = {}
    ) => {
        if(!userAuth) return;

        const userDocRef = doc(db,'users', userAuth.uid);

         

        const userSnapshot= await getDoc(userDocRef);
        

        if(!userSnapshot.exists()) {
            const { displayName, email } = userAuth;
            const createdAt = new Date();

            try{
                await setDoc(userDocRef, {
                    displayName,
                    email,
                    createdAt,
                    ...additionalInformartion, 
                });
            }catch (error){
                console.log('error creating the user', error.message);
            }
       }

         return userDocRef;
    }; 

    export const createAuthUserWithEmailAndPassword = async (email, password) => {
        if(!email || !password) return;

        return await createUserWithEmailAndPassword(auth, email, password);
    };


    export const signInAuthUserWithEmailAndPassword = async (email, password) => {
        if(!email || !password) return;

        return await signInWithEmailAndPassword(auth, email, password);
    };

    export const signOutUser = async () => await signOut(auth);

    export const onAuthStateChangedListener = (callback) =>
    onAuthStateChanged(auth,callback);