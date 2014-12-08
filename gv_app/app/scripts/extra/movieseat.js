var movieseat_init = function ($item, reservedSeat) {
    console.log(reservedSeat);
    var str = [], seatNo, className;
    for (i = 0; i < settings.rows; i++) {
        for (j = 0; j < settings.cols; j++) {
            seatNo = (i + j * settings.rows + 1);
            className = settings.seatCss + ' ' + settings.rowCssPrefix + i.toString() + ' ' + settings.colCssPrefix + j.toString();
            if ($.isArray(reservedSeat) && $.inArray(seatNo, reservedSeat) != -1) {
                className += ' ' + settings.selectedSeatCss;
            }
            str.push('<li ng-click="console.log(clicked);" class="' + className + '"' +
                      'style="top:' + (i * settings.seatHeight).toString() + 'px;left:' + (j * settings.seatWidth).toString() + 'px;width:'+(settings.seatWidth-settings.margin).toString()+'px;height:'+(settings.seatHeight-settings.margin).toString()+'px;">' +
                      '<a title="' + seatNo + '">' + "" + '</a>' +
                      '</li>');
        }
    }
    $item.html(str.join(''));
};

var settings = {
               rows: 7,
               cols: 11,
               rowCssPrefix: 'row-',
               colCssPrefix: 'col-',
               seatWidth: 23,
               seatHeight: 23,
               margin: 3,
               seatCss: 'seat',
               selectedSeatCss: 'selectedSeat',
               selectingSeatCss: 'selectingSeat'
           };   

//case I: Show from starting

$('.btnShow').click(function () {
    var str = [];
    $.each($('.place li.' + settings.selectedSeatCss + ' a, .place li.'+ settings.selectingSeatCss + ' a'), function (index, value) {
        str.push($(this).attr('title'));
    });
    alert(str.join(','));
})
 
$('.btnShowNew').click(function () {
    var str = [], item;
    $.each($('.place li.' + settings.selectingSeatCss + ' a'), function (index, value) {
        item = $(this).attr('title');                   
        str.push(item);                   
    });
    alert(str.join(','));
})
