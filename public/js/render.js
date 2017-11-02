/* global $ */
'use strict';
/**
 * RENDER METHODS
 * 
 * Primary Job: Direct DOM Manipulation
 * 
 * Rule of Thumb:
 * - Direct DOM manipulation OK
 * - Never update state/store
 * 
 */

let title;

var render = {
  page: function (state) {
    if (state.demo) {
      $('.view').css('background-color', 'gray');
      $('#' + state.view).css('background-color', 'white');
    } else {
      $('.view').hide();
      $('#' + state.view).show();  
    }

  },
  results: function (state) {
    const listItems = state.list.map((item) => {
      return `<li id="${item.id}">
                <a href="" class="detail">${item.name} ${item.date}</a>
                <a href="#" class="remove"></a>
              </li>`;
    });
    $('#result').empty().append('<ul>').find('ul').append(listItems);
  },
  
  edit: function (state) {
    const el = $('#edit');
    const item = state.item;
    el.find('[name=name]').val(item.name);
  },
  detail: function (state) {
    const el = $('#detail');
    const item = state.item;
    title = item.name;
    el.find('.date').text(`${item.date}`);
    el.find('.name').text(` ${item.name}`);
    el.find('.tagline').text(`${item.tagline} `);
    el.find('.movieId').text(`${item.id} `);
    window.activeMovieId = item.id;
  },
  review: function (state) {
    const el = $('#review');
    const item = state.item;
    console.log('===========', title);
    el.find('.review').text(`${item.content}`);
    el.find('.review-movie').text(`Movie: ${title}`);
    // el.find('.tagline').text(`${item.tagline} `);
    // el.find('.movieId').text(`${item.id} `);
    window.activeMovieId = item.id;
  },
  status: function (state) {
    const timer = state.timer;
    switch (timer.status) {
    case 'warning':
      $('#statusbar').css('background-color', 'orange').find('.message').text(timer.status);
      break;
    case 'expired':
      $('#statusbar').css('background-color', 'red').find('.message').text(timer.status);
      break;
    default:
      $('#statusbar').css('background-color', 'grey').find('.message').text(timer.status);
      break;
    }
  }
};
