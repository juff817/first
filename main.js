/**
 * check if a character is dictionary char.
 * @param  {char}  ch char to check
 * @return {Boolean}    true if it is 'A'-'Z' or 'a'-'z'
 */
function isAlpha(ch) {
  return (ch >= 'A' && ch <= 'z');
}

/**
 * parse lrc time format to second(like 3.34)
 * @param  {String} strTime source lrc-format time
 * @return {Number}         a float number stands for second.
 */
function parseTime(strTime) {
  //souce format: MM:SS.mm
  var src = strTime.split(/\:|\./);
  return parseFloat(src[0]) * 60.0 + parseFloat(src[1]) + parseFloat(src[2]) / 100.0;
}

$(function() {
  /* step1: load lrc into a 'box', where here is a div of '#lrc-box .lyrics' */
  $('#lrc-box .lyrics').each(function() {
    this.innerHTML = 
`[ti:冷暴力]
[ar:星弟&任然]
[al:同归于尽]
[00:00.62]星弟、任然 - 冷暴力
[00:01.73]词曲：星弟
[00:02.65]编曲：星弟
[00:04.03]混音：星弟
[00:04.74]制作人：星弟
[00:10.88]
[00:28.08]沉默 你不说 低着头 哼着歌
[00:31.36]不懂 猜不透 解不开你赐予我的疑惑
[00:35.87]犯错 我认错 你却把自己 反锁
[00:41.26]
[00:41.82]难过 我难过 你挣脱 你闪躲
[00:45.01]我向右 你向左 两个人比一个人还寂寞
[00:49.68]你冷漠地叹息 让我不知所措
[00:54.96]谁告诉我 怎么挣脱
[00:58.30]你的冷漠 我不想再去迎合 去触摸
[01:03.17]怎么 逃脱 这个 漩涡
[01:06.50]
[01:08.73]谁告诉我 怎么解脱
[01:12.07]你的沉默 我不想再去附和 去切磋
[01:17.09]你的 冷暴力杀死我
[01:20.53]
[01:38.48]你高傲 我知道
[01:39.94]你内心的思绪万千 我猜不到
[01:42.47]我骄躁 爱计较
[01:44.25]你的忍耐被我消耗
[01:45.87]可是 你从不回应的方式太折磨太煎熬
[01:49.32]情人也该有的礼貌
[01:51.04]我和你都需要治疗
[01:52.81]办不到
[01:53.57]你不是我的敌人为何朝我冷笑
[01:56.12]受不了 快疯掉
[01:57.84]我脑子里充满问号
[01:59.60]我懊恼 却 怎么也不懂换位思考
[02:02.95]进行这无声的争吵
[02:04.67]听着你无声的咆哮
[02:05.54]谁告诉我 怎么挣脱
[02:08.67]你的冷漠 我不想再去迎合 去触摸
[02:13.54]怎么 逃脱 这个 漩涡
[02:18.86]谁告诉我 怎么解脱
[02:22.31]你的沉默 我不想再去附和 去切磋
[02:27.22]你的 冷暴力杀死我
[02:30.72]
[02:46.44]谁告诉我 怎么挣脱
[02:49.89]你的冷漠 我不想再去迎合 去触摸
[02:54.61]怎么 逃脱 这个 漩涡
[02:59.99]谁告诉我 怎么解脱
[03:03.43]你的沉默 我不想再去附和 去切磋
[03:08.24]你的 冷暴力杀死我
[03:30.85]
[03:39.69]`;
    /* step2: get the string and analysis it */
    var data = this.innerHTML.split('\n'); //cut source data into multiple lines

    /* step3-1: divide the header and lyric body, like ti, ar, al and others */
    var header = {
      ti: '', //title
      ar: '', //artiest
      al: '' //album
    }; //header
    var timeLine = [0.0]; //time
    var paragraph = ['^_^']; //words mapping of time above
    for (var i = 0; i < data.length; ++i) {
      if (data[i] !== '') {
        var line = data[i].split(/\[|\]/);
        if (line[1] && isAlpha(line[1].charAt(0))) {
          var pair = line[1].split(/\:/);
          header[pair[0]] = pair[1];
        } else if (line[1]) {
          timeLine.push(parseTime(line[1]));
          paragraph.push(line[2] || '');
        }
      }
    }
    // console.log(header);
    // console.log(timeLine);
    // console.log(paragraph);
    /**
     * And now, we get the information to show
     * total durations => timeLine.length
     * for time from timeLine[i] to timeLine[i + 1], we should
     *   highlight paragraph of paragraph[i].
     * By the way, we add a timing of 'forever' to set the end point.
     */
    timeLine.push(100007); //timing(the 100007th second)

    /**
     * Now, it's time to depend the way of showing the lyrics.
     * We can maintain a queue, for example, with size of 8,
     * and push a string into it each time, also, when the strings
     * in it grow to bigger than 8, we make a popping-up action.
     * It's all thing we may do at this step :)
     */
    /**
     * So, here is step3-2
     */
    /**
     * queue of size MAX, in fact, in order to reduce memory allocate,
     * we will only PUSH elements and remember the HEAD position, but not
     * POP any element ~
     * so we will use (the total array if and only if buffer.length <= MAX)
     *   or (the elements of buffer[buffer.length - 9 : buffer.length - 1]
     *     if and only if buffer.length > MAX)
     */

    var MAX = 8;
    var buffer = [];
    var len = paragraph.length;
    var ps = '';
    for (i = 0; i < len; ++i) {
      ps += '<p pid=' + i + ' style="opacity: 0.4; margin-top: 25px;">' + paragraph[i] + '</p>'
    }
    $('#lrc-box').append(ps);
    for (i = 0; i < len; ++i) {
      $('#lrc-box')
      .find('p[pid = ' + i + ']')
      .delay(timeLine[i] * 1000)
      //.css('opacity', '0')
      .animate({
        opacity: '+=0.6',
        top: '-=18'
      }, 1000, function() {
        /* stuff to do after animation is complete */
        var pid = parseInt(this.getAttribute('pid'));
        $(this)
        .delay((timeLine[pid + 1] - timeLine[pid]) * 1000)
        .animate({
          opacity: '-=0.3'
        }, 1000, function()  {
          var pid = parseInt(this.getAttribute('pid'));
          console.log(timeLine[pid + 8]);
          $(this)
          .delay(((timeLine[pid + 8] || 100007) - timeLine[pid + 1]) * 1000)
          .slideUp(300);
        });
      });
    }
  });
});