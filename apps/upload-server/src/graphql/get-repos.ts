export const GET_REPOS = `
                    query ($username: String!) {
                    user(login: $username) {
                        repositories(first: 100) {
                            nodes {
                                name
                                url
                            }
                        }
                    }
                }`