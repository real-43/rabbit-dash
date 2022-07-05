import { auth } from '../Firebase Config/firebase'

const authentication = onAuthStateChanged(auth,(user) => {
    if (user) {
        router('/dashboard')
    } else {
        router('/')
    }
    return authentication
})

export { authentication }