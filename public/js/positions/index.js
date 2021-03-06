var onLoadCallback = (function() {
  function enableDialogs() {
    $('.dialog').dialog({
      autoOpen: false,
      buttons: {
        Create: submitForm,
        Cancel: function() { $(this).dialog('close') }
      }
    }).each(function() {
      var d = $(this);
      d.dialog('option', 'title', d.attr('data-dialog-title')).
      dialog('option', 'height', d.attr('data-dialog-height')).
      dialog('option', 'width', d.attr('data-dialog-width')).
      dialog('option', 'modal', d.hasClass('modal'));
    });
  }

  function submitForm() {
    $(this).find('form').submit()
  }

  function _handleFormSubmit(form, options) {
    form.submit(function(event) {
      event.preventDefault();
      $.ajax({
        type: 'POST',
        url: this.action + '.json',
        dataType: 'json',
        data: $(this).serialize(),
        success: options.onSuccess,
        error: function(req, text) { alert(errorMsg(req)) }
      });
      return false;
    });
  }

  function errorMsg(req) {
    try {
      var error = eval('(' + req.responseText + ')');
    } catch(e) {
      var error = {}
    }
    var msg = [];
    for(var k in error) {
      msg.push(error[k])
    }
    return msg.join("\n");
  }

  function handleFormSubmit() {
    _handleFormSubmit($('#category-form').find('form'), {
      onSuccess: function(data) {
        $('<option/>').attr('value', data.id).attr('selected', 'selected').
          text(data.name).appendTo(
            $('#position-form').find('select[name=position[category]]')
          );
        $('#category-form').dialog('close');
      }
    });
    _handleFormSubmit($('#position-form').find('form'), {
      onSuccess: function(data) {
        addPosition(data);
        $('#position-form').dialog('close');
      }
    });
  }

  function activeLinks() {
    $.each(['position', 'category'], function() {
      var name = this;
      $('#button-link-' + name + '-new').click(function(event) {
        event.preventDefault();
        $('#' + name + '-form').dialog('open');
        return false;
      });
    });
  }

  function addPosition(object) {
    var tr = $('<tr/>');
    $('<td/>').text(object.category.name).appendTo(tr);
    $('<td/>').text(object.name).appendTo(tr);
    $('<td/>').text(object.description).appendTo(tr);
    $('<td/>').text(object.state).appendTo(tr);
    tr.appendTo($('#position-list').find('tbody'));
  }

  return function() {
    enableDialogs();
    handleFormSubmit();
    activeLinks();
  }
})();
