var dom = document.querySelector('.project-content-wrap')
var img = dom.querySelectorAll('img')
var src = []
img.forEach((item) => {
  var srcset = item.getAttribute('srcset')
  if (srcset && srcset.includes('w,')) {
    src.push(
      srcset.split(',').filter((item) => item.length).pop().trim().split(' ')[0]
    )
  }
})
var str = ''
src.forEach((item) => {
  str += `<img src=${item}/>`
})
document.body.innerHTML = str


var p = new Promise((resolve) => {
  console.log(4)
  resolve(5)
})

function func1() {
  console.log(1)
}

function func2() {
  setTimeout(() => {
    console.log(2)
  })
  func1()
  console.log(3)
  p.then((res) => {
    console.log(res)
  }).then(() => {
    console.log(6)
  })
}

func2()

// 4
// 1
// 3
// 5
// 6
// 2


var a = { foo: 1 }
console.log(
  eval("a['foo']")
)