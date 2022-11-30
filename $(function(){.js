$(function(){
    var v = $('#video').attr('class').split('video-')[1],
      // получаем идентификатор видео из атрибута class
      player = false,
      // плеер не запущен
      key = '',
      // обязательно требуется ваш ключ YouTube API!
      url = 'http://gdata.youtube.com/feeds/api/videos/'+v+'?callback=?&key='+key+'&format=5&alt=json';
      // запрос указанного видео, который мы пытаемся получить через AJAX с другого домена
      // будет предотвращён правилом ограничения домена.
      // чтобы побороть это, мы должны использовать в запрашиваемом адресе callback=?
      // это должно помочь нам преодолеть междоменный барьер
      $('#video-'+v).live('player', function(){
        // метод live() позволяет менять элементы ещё не добавленные в DOM
        var play = function(){
          $('.controls').find('.play').addClass('pause').removeClass('play');
        }, pause = function(){
          $('.controls').find('.pause').removeClass('pause').addClass('play');
        }
        // создаём функции воспроизведения/паузы простым изменением
        // класса кнопки управления
        $(this).tubeplayer({
          width: 500,
          // устанавливаем ширину плеера
          height: 350,
          // устанавливаем высоту плеера
          initialVideo: v,
          // запускаем TubePlayer с указанным видео
          allowFullScreen: false,
          onPlayerPlaying: function(){
            play();
          },
          onPlayerPaused: function(){
            pause();
          },
          onPlayerEnded: function(){
            pause();
          },
          onStop: function(){
            pause();
          }
        });
        if (!$(this).find('.stop').length)
          $(this).prepend($('<a />').attr('href', '#').addClass('stop').text('Остановить'));
          // добавить кнопку закрыть к всплывающему окну
        player = true;
        // плеер запущен
      });
      $.getJSON(url, function(response){
        var html = '',
        video = response.entry, // получаем объект JSON
        title = video.title.$t, // получаем заголовок
        category = video.media$group.media$category[0].label, // получаем название категории
        thumb = video.media$group.media$thumbnail[2].url, // получаем путь к миниатюре
        views = video.yt$statistics.viewCount, // получаем число просмотров
        favs = video.yt$statistics.favoriteCount, // получаем число понравившим
        duration = video.media$group.yt$duration.seconds; // получаем продолжительность видео
        html += '<div class="image">';
        html += '<img src="'+thumb+'" alt="" />';
        html += '<div class="controls"><a href="#" class="play">Воспроизвести</a></div>';
        html += '</div>';
        html += '<div class="entry">';
        html += '<p class="title">'+title+' ('+parseInt(duration/60)+':'+duration%60+')</p>';
        html += '<span>Просмотров: '+views+'</span>';
        html += '<span>Категория: '+category+'</span>';
        html += '<span class="favs">'+favs+'</span>';
        html += '</div>';
        $('#video').html(html).after(
          $('<div />').attr('id', 'video-'+v).addClass('ytube')
        );
        // создаём div, который содержит Flash из SWFObject
      });
      $('.controls').find('.play').live('click', function(){
        player == true ? $('#video-'+v).tubeplayer('play') : $('#video-'+v).fadeIn().trigger('player');
        // создаём плеер, если он не запущен
        return false;
      });
      $('.controls').find('.pause').live('click', function(){
        $('#video-'+v).tubeplayer('pause');
        return false;
      });
      $('#video-'+v).find('.stop').live('click', function(){
        $('#video-'+v).tubeplayer('stop').fadeOut();
        player = false;
        return false;
      });
  });