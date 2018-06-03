import $ from 'jquery'
import {
  sum
} from './libs/util'

import defaults from 'lodash-es/defaults'

import './styles/reset.css'
import './styles/reset2.css'
import './styles/sass.sass'
import './styles/scss.scss'

console.log($.fn.jquery)
console.log(sum(1, 4))

console.log(defaults({
  'a': 1
}, {
  'a': 3,
  'b': 2
}))

$('#test').text('标题')

if (module.hot) {
  // 实现热更新
  module.hot.accept();
}