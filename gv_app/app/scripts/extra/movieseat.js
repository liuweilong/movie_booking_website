var movieseat_init = function ($item, reservedSeat) {
    var str = [], seatNo, className;
    for (i = 0; i < settings.rows; i++) {
        for (j = 0; j < settings.cols; j++) {
            seatNo = (i + j * settings.rows + 1);
            className = settings.seatCss + ' ' + settings.rowCssPrefix + i.toString() + ' ' + settings.colCssPrefix + j.toString();
            if ($.isArray(reservedSeat) && $.inArray(seatNo, reservedSeat) != -1) {
                className += ' ' + settings.selectedSeatCss;
            }
            str.push('<li class="' + className + '"' +
                      'style="top:' + (i * settings.seatHeight).toString() + 'px;left:' + (j * settings.seatWidth).toString() + 'px;width:'+settings.seatWidth.toString()+'px;height:'+settings.seatHeight.toString()+'px;">' +
                      '<a title="' + seatNo + '">' + "" + '</a>' +
                      '</li>');
        }
    }
    $item.html(str.join(''));
};

var settings = {
               rows: 5,
               cols: 15,
               rowCssPrefix: 'row-',
               colCssPrefix: 'col-',
               seatWidth: 20,
               seatHeight: 20,
               seatCss: 'seat',
               selectedSeatCss: 'selectedSeat',
               selectingSeatCss: 'selectingSeat'
           };   

//case I: Show from starting
//init();

$('.' + settings.seatCss).click(function () {
if ($(this).hasClass(settings.selectedSeatCss)){
    alert('This seat is already reserved');
}
else{
    $(this).toggleClass(settings.selectingSeatCss);
    }
});
 
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
