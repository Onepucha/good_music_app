export { fakeBackend }

// array in local storage for registered users
const usersKey = 'vue-3-pinia-registration-login-example-users'
let users = JSON.parse(localStorage.getItem(usersKey) as any) || []

function fakeBackend() {
  const realFetch = window.fetch
  window.fetch = function (url: any, opts: any) {
    return new Promise((resolve: any, reject: any) => {
      // wrap in timeout to simulate server api call
      setTimeout(handleRoute, 500)

      function handleRoute() {
        switch (true) {
          case url.endsWith('/users/authenticate') && opts.method === 'POST':
            return authenticate()
          case url.endsWith('/users/register') && opts.method === 'POST':
            return register()
          case url.endsWith('/users') && opts.method === 'GET':
            return getUsers()
          case url.match(/\/users\/\d+$/) && opts.method === 'GET':
            return getUserById()
          case url.endsWith('/releases') && opts.method === 'GET':
            return getReleases()
          case url.endsWith('/artist') && opts.method === 'GET':
            return getArtists()
          case url.endsWith('/popularArtist') && opts.method === 'GET':
            return getPopularArtists()
          case url.endsWith('/charts') && opts.method === 'GET':
            return getCharts()
          case url.endsWith('/albums') && opts.method === 'GET':
            return getAlbums()
          case url.match(/\/users\/\d+$/) && opts.method === 'PUT':
            return updateUser()
          case url.match(/\/users\/\d+$/) && opts.method === 'DELETE':
            return deleteUser()
          default:
            // pass through any requests not handled above
            return realFetch(url, opts)
              .then((response: any) => resolve(response))
              .catch((error) => reject(error))
        }
      }

      // route functions
      function authenticate() {
        const { email, password } = body()
        const user = users.find(
          (x: any) => x.email === email && x.password === password
        )

        if (!user) return error('Email or password is incorrect')

        return ok({
          ...basicDetails(user),
          token: 'fake-jwt-token',
          isAuth: true,
        })
      }

      function register() {
        const user = body()

        if (users.find((x: any) => x.email === user.email)) {
          return error('Email «' + user.email + '» is already taken')
        }

        user.id = users.length
          ? Math.max(...users.map((x: any) => x.id)) + 1
          : 1
        users.push(user)
        localStorage.setItem(usersKey, JSON.stringify(users))
        return ok(true)
      }

      function getUsers() {
        if (!isAuthenticated()) return unauthorized()
        return ok(users.map((x: any) => basicDetails(x)))
      }

      function getUserById() {
        if (!isAuthenticated()) return unauthorized()

        const user = users.find((x: any) => x.id === idFromUrl())
        return ok(basicDetails(user))
      }

      function updateUser() {
        if (!isAuthenticated()) return unauthorized()

        const params = body()
        const user = users.find((x: any) => x.id === idFromUrl())

        // only update password if entered
        if (!params.password) {
          delete params.password
        }

        // if email changed check if taken
        if (
          params.email !== user.email &&
          users.find((x: any) => x.email === params.email)
        ) {
          return error('Email «' + params.email + '» is already taken')
        }

        // update and save user
        Object.assign(user, params)
        localStorage.setItem(usersKey, JSON.stringify(users))

        return ok(true)
      }

      function deleteUser() {
        if (!isAuthenticated()) return unauthorized()

        users = users.filter((x: any) => x.id !== idFromUrl())
        localStorage.setItem(usersKey, JSON.stringify(users))
        return ok(true)
      }

      function getArtists() {
        return ok([
          {
            _id: '1',
            imageUrl: '/images/artists/theWeeknd.png',
            name: 'The Weeknd',
            verified: true,
            follow: false,
          },
          {
            _id: '2',
            imageUrl: '/images/artists/arianaGrande.png',
            name: 'Ariana Grande',
            verified: false,
            follow: false,
          },
          {
            _id: '3',
            imageUrl: '/images/artists/katyPerry.png',
            name: 'Katy Perry',
            verified: true,
            follow: false,
          },
          {
            _id: '4',
            imageUrl: '/images/artists/ryanJones.png',
            name: 'Ryan Jones',
            verified: true,
            follow: false,
          },
          {
            _id: '5',
            imageUrl: '/images/artists/acidrap.png',
            name: 'Acidrap',
            verified: true,
            follow: false,
          },
          {
            _id: '6',
            imageUrl: '/images/artists/cleanBandit.png',
            name: 'Clean Bandit',
            verified: true,
            follow: false,
          },
        ])
      }

      function getReleases() {
        return ok([
          {
            _id: 1,
            imageUrl: '/images/newReleases/aniaSzarmach.png',
            name: 'Shades of Love - Ania Szarmach',
            code: '1',
          },
          {
            _id: 2,
            imageUrl: '/images/newReleases/kidLaroi.png',
            name: 'Without You - The Kid LAROI',
            code: '2',
          },
          {
            _id: 3,
            imageUrl: '/images/newReleases/theWeekndAri.png',
            name: 'Save Your Tears The Weeknd & Ari',
            code: '3',
          },
          {
            _id: 4,
            imageUrl: '/images/newReleases/aniaSzarmach.png',
            name: 'Shades of Love - Ania Szarmach',
            code: '4',
          },
          {
            _id: 5,
            imageUrl: '/images/newReleases/kidLaroi.png',
            name: 'Without You - The Kid LAROI',
            code: '5',
          },
          {
            _id: 6,
            imageUrl: '/images/newReleases/theWeekndAri.png',
            name: 'Save Your Tears The Weeknd & Ari',
            code: '6',
          },
        ])
      }

      function getPopularArtists() {
        return ok([
          {
            _id: 1,
            imageUrl: '/images/artists/arianaGrande.png',
            name: 'Ariana Grande',
            code: '1',
          },
          {
            _id: 2,
            imageUrl: '/images/artists/theWeeknd.png',
            name: 'The Weeknd',
            code: '2',
          },
          {
            _id: 3,
            imageUrl: '/images/artists/acidrap.png',
            name: 'Acidrap',
            code: '3',
          },
          {
            _id: 4,
            imageUrl: '/images/artists/arianaGrande.png',
            name: 'Ariana Grande',
            code: '4',
          },
          {
            _id: 5,
            imageUrl: '/images/artists/theWeeknd.png',
            name: 'The Weeknd',
            code: '5',
          },
          {
            _id: 6,
            imageUrl: '/images/artists/acidrap.png',
            name: 'Acidrap',
            code: '6',
          },
        ])
      }

      function getCharts() {
        return ok([
          {
            _id: 1,
            name: 'TOP 100 - Global',
            code: '1',
          },
          {
            _id: 2,
            name: 'TOP 100 - United States',
            code: '2',
          },
          {
            _id: 3,
            name: 'TOP 100 - United States',
            code: '3',
          },
          {
            _id: 4,
            name: 'TOP 100 - Global',
            code: '4',
          },
          {
            _id: 5,
            name: 'TOP 100 - United States',
            code: '5',
          },
          {
            _id: 6,
            name: 'TOP HITS - Indonesia',
            code: '6',
          },
        ])
      }

      function getAlbums() {
        return ok([
          {
            _id: '1',
            position: '1',
            imageUrl: '/images/albums/handsome.png',
            name: 'HANDSOME',
            artist: 'Warren Hue',
            code: '1',
            issueYear: '2022',
          },
          {
            _id: '2',
            position: '2',
            imageUrl: '/images/albums/sharks.png',
            name: 'Sharks',
            artist: 'Imagine Dragons',
            code: '2',
            issueYear: '2021',
          },
          {
            _id: '3',
            position: '3',
            imageUrl: '/images/albums/somebodysNobody.png',
            name: 'Somebody’s Nobody',
            artist: 'Alexander 23',
            code: '3',
            issueYear: '2019',
          },
          {
            _id: '4',
            position: '4',
            imageUrl: '/images/albums/breackMySoul.png',
            name: 'BREAK MY SOUL',
            artist: 'Beyonce',
            code: '4',
            issueYear: '2022',
          },
          {
            _id: '5',
            position: '5',
            imageUrl: '/images/albums/disaster.png',
            name: 'Disaster',
            artist: 'Conan Gray',
            code: '5',
            issueYear: '2018',
          },
        ])
      }

      // helper functions
      function ok(body: any) {
        resolve({ ok: true, ...headers(), json: () => Promise.resolve(body) })
      }

      function unauthorized() {
        resolve({
          status: 401,
          ...headers(),
          json: () => Promise.resolve({ message: 'Unauthorized' }),
        })
      }

      function error(message: any) {
        resolve({
          status: 400,
          ...headers(),
          json: () => Promise.resolve({ message }),
        })
      }

      function basicDetails(user: any) {
        const { id, email, avatar, fullname, nickname, dob } = user
        return { id, email, avatar, fullname, nickname, dob }
      }

      function isAuthenticated() {
        return opts.headers['Authorization'] === 'Bearer fake-jwt-token'
      }

      function body() {
        return opts.body && JSON.parse(opts.body)
      }

      function idFromUrl() {
        const urlParts = url.split('/')
        return parseInt(urlParts[urlParts.length - 1])
      }

      function headers() {
        return {
          headers: {
            get() {
              return ['application/json']
            },
          },
        }
      }
    })
  }
}
