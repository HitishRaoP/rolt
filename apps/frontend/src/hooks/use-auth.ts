import { FirebaseAuthentication } from "@capacitor-firebase/authentication"
import { GithubAuthProvider, signInWithCredential } from "firebase/auth"
import { auth } from "@/lib/firebase"

export const signInWithGithub = async () => {
    try {
        const result = await FirebaseAuthentication.signInWithGithub()

        if (!result.credential?.accessToken) throw new Error("No access token received.")

        const credential = GithubAuthProvider.credential(result.credential.accessToken)
        const userCredential = await signInWithCredential(auth, credential)

        console.log("Signed in!", userCredential.user)
        return userCredential.user
    } catch (error) {
        console.error("GitHub Sign-In Error:", error)
        throw error
    }
}
