var $ = (e)=> document.getElementById(e);

var __windowm__ = (()=>{

  var windowNum = 0;
  var winds = [];
  var wmOverflow = false;

  function createWind() {

    function foc() {

      if(w.focused) return false;

      for(let i = 0; i < winds.length; ++i) {

        winds[i].focused = false;
        winds[i].dom.style.zIndex = parseInt(winds[i].dom.style.zIndex) - 1;
        winds[i].wmdom.classList.remove('foc');

      }
      w.focused = true;
      w.dom.style.zIndex = winds.length;
      w.dom.classList.remove('hid');
      w.wmdom.classList.add('foc');
      w.wmdom.classList.remove('hid');

    }

    function hid(e) {

      e.stopPropagation();

      w.focused = false;
      w.dom.classList.add('hid');
      w.wmdom.classList.add('hid');
      w.wmdom.classList.remove('foc');

    }

    var w = {
      id: ++ windowNum,
      dom: null,
      wmdom: null,
      focused: false,
      foc: foc
    };

    // === Create Window Start ===
    w.dom = (()=> {

      var div = document.createElement('div');

      var header = (()=> {

        var hea = document.createElement('header');

        var span = document.createElement('span');
        span.textContent = w.id;
        hea.append(span);

        var ctrl = (()=> {

          var div = document.createElement('div');

          var hidB = document.createElement('div');
          hidB.onclick = hid;
          div.append(hidB);

          var shutB = document.createElement('div');
          shutB.onclick = (e)=> {

            e.stopPropagation();

            winds.splice(winds.indexOf(w), 1);

            w.dom.remove();
            w.wmdom.remove();

          };
          div.append(shutB);

          return div;
        })();
        hea.append(ctrl);

        var pos = [60, 80];
        hea.onmousedown = (e)=> {

          var mPos = [0, 0];

          document.onmousemove = (_e)=> {

            mPos[0] = _e.clientX - e.clientX;
            mPos[1] = _e.clientY - e.clientY;

            div.style.transform = `translate(${pos[0] + mPos[0]}px, ${pos[1] + mPos[1]}px`;

          };

          document.onmouseup = ()=> {

            pos[0] += mPos[0];
            pos[1] += mPos[1];

            document.onmousemove = null;
            document.onmouseup = null;

          }

        };

        return hea;
      })();
      div.append(header);

      div.style.zIndex = w.id;
      div.onmousedown = foc;
      
      return div;
    })();
    $('winds').append(w.dom);
    // === Create Window End ===


    // === Window Manager Start ===
    w.wmdom = (()=>{
      var div = document.createElement('div');
      div.innerHTML = `<span>${w.id}</span>`;

      div.onmousedown = foc;

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '50');
      svg.setAttribute('height', '50');
      svg.innerHTML = '<path d="M15 10 L25 20 L35 10 L40 15 L30 25 L40 35 L35 40 Z"></path>';
      svg.onclick = ()=> {

        winds.splice(winds.indexOf(w), 1);

        w.dom.remove();
        div.remove();

        if($('windowm-list').clientWidth < $('windowm').clientWidth) {
          wmOverflow = false;
          $('windowm-tip').classList.remove('act');
        }

      };
      div.append(svg);

      $('windowm-list').append(div);

      if($('windowm-list').clientWidth > $('windowm').clientWidth) {
        wmOverflow = true;
        $('windowm-tip').classList.add('act');
      }

      return div;
    })();
    // === Window Manager End ===

    foc();

    winds.push(w);

  }

  $('windowm-add').onclick = ()=> {

    createWind()

  };

  $('windowm').onwheel = (e)=> {

    var focusedI = 0;
    for(let i = 0; i < winds.length; ++i) {
      if(winds[i].focused) focusedI = i;
    }

    if (e.deltaY > 0) {
      focusedI = focusedI+1 >= winds.length ? 0 : focusedI+1;
    }
    else {
      focusedI = focusedI-1 < 0 ? winds.length-1 : focusedI-1;
    }

    winds[focusedI].foc();

    if(wmOverflow) {
      $('windowm-list').style.transform = `translateX(${
        $('windowm').clientWidth / 2 - winds[focusedI].wmdom.offsetLeft
      }px)`;
    }
    else {
      $('windowm-list').style.transform = null
    }

  };

})();
