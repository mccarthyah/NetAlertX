/* -----------------------------------------------------------------------------
*  NetAlertX
*  Open Source Network Guard / WIFI & LAN intrusion detector 
*
*  ui_components.js - Front module. Common UI components
*-------------------------------------------------------------------------------
#  jokob             jokob@duck.com                GNU GPLv3
----------------------------------------------------------------------------- */


// -----------------------------------------------------------------------------
// Initialize device selectors / pickers fields
// -----------------------------------------------------------------------------
function initDeviceSelectors(devicesListAll_JSON) {

  // Check if both device list exists
  if (devicesListAll_JSON) {
      // Parse the JSON string to get the device list array
      var devicesList = JSON.parse(devicesListAll_JSON);

      var selectorFieldsHTML = ''

      // Loop through the devices list
      devicesList.forEach(function(device) {         

          selectorFieldsHTML += `<option value="${device.devMac}">${device.devName}</option>`;
      });

      selector = `<div class="db_info_table_row  col-sm-12" > 
                    <div class="form-group" > 
                      <div class="input-group col-sm-12 " > 
                        <select class="form-control select2 select2-hidden-accessible" multiple=""  style="width: 100%;"  tabindex="-1" aria-hidden="true">
                        ${selectorFieldsHTML}
                        </select>
                      </div>
                    </div>
                  </div>`


      // Find HTML elements with class "deviceSelector" and append selector field
      $('.deviceSelector').append(selector);
  }

  // Initialize selected items after a delay so selected macs are available in the context
  setTimeout(function(){
        // Retrieve MAC addresses from query string or cache
        var macs = getQueryString('macs') || getCache('selectedDevices');

        if(macs)
        {
          // Split MAC addresses if they are comma-separated
          macs = macs.split(',');
  
          console.log(macs)

          // Loop through macs to be selected list
          macs.forEach(function(mac) {

            // Create the option and append to Select2
            var option = new Option($('.deviceSelector select option[value="' + mac + '"]').html(), mac, true, true);

            $('.deviceSelector select').append(option).trigger('change');
          });       

        }        
    
    }, 10);
}

// -------------------------------------------------------------------
// Utility function to generate a random API token in the format t_<random string of specified length>
function generateApiToken(elem, length) {
  // Retrieve and parse custom parameters from the element
  let params = $(elem).attr("my-customparams")?.split(',').map(param => param.trim());
  if (params && params.length >= 1) {
    var targetElementID = params[0];  // Get the target element's ID
  }

  let targetElement = $('#' + targetElementID);

  // Function to generate a random string of a specified length
  function generateRandomString(len) {
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  // Generate the token in the format t_<random string of length>
  let randomToken = 't_' + generateRandomString(length);

  // Set the generated token as the value of the target element
  if (targetElement.length) {
    targetElement.val(randomToken);
  }
}


// ----------------------------------------------
// Updates the icon preview  
function updateIconPreview(elem) {
  const targetElement = $('[my-customid="NEWDEV_devIcon_preview"]');
  const iconInput = $("#NEWDEV_devIcon");

  let attempts = 0;

  function tryUpdateIcon() {
    let value = iconInput.val();

    if (value) {
      targetElement.html(atob(value));
      iconInput.off('change input').on('change input', function () {
        let newValue = $(this).val();
        targetElement.html(atob(newValue));
      });
      return; // Stop retrying if successful
    } 

    attempts++;
    if (attempts < 10) {
      setTimeout(tryUpdateIcon, 1000); // Retry after 1 second
    } else {
      console.error("Input value is empty after 10 attempts");
    }
  }

  tryUpdateIcon();
}



// -----------------------------------------------------------------------------
// Nice checkboxes with iCheck
function initializeiCheck () {
  // Blue
  $('input[type="checkbox"].blue').iCheck({
    checkboxClass: 'icheckbox_flat-blue',
    radioClass:    'iradio_flat-blue',
    increaseArea:  '20%'
  });

 // Orange
 $('input[type="checkbox"].orange').iCheck({
   checkboxClass: 'icheckbox_flat-orange',
   radioClass:    'iradio_flat-orange',
   increaseArea:  '20%'
 });

 // Red
 $('input[type="checkbox"].red').iCheck({
   checkboxClass: 'icheckbox_flat-red',
   radioClass:    'iradio_flat-red',
   increaseArea:  '20%'
 });

 
}


// -----------------------------------------------------------------------------
// Generic function to copy text to clipboard
function copyToClipboard(buttonElement) {
  const text = $(buttonElement).data('text');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showMessage('Copied to clipboard: ' + text, 1500);
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  } else {
    // Fallback to execCommand if Clipboard API is not available
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showMessage('Copied to clipboard: ' + text, 1500);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
    document.body.removeChild(tempInput);
  }
}

// -----------------------------------------------------------------------------
// Simple Sortable Table columns 
// -----------------------------------------------------------------------------

function sortColumn(element) {
  var th = $(element).closest('th');
  var table = th.closest('table');
  var columnIndex = th.index();
  var ascending = !th.data('asc');
  sortTable(table, columnIndex, ascending);
  th.data('asc', ascending);
}

function sortTable(table, columnIndex, ascending) {
  var tbody = table.find('tbody');
  var rows = tbody.find('tr').toArray().sort(comparer(columnIndex));
  if (!ascending) {
    rows = rows.reverse();
  }
  for (var i = 0; i < rows.length; i++) {
    tbody.append(rows[i]);
  }
}

function comparer(index) {
  return function(a, b) {
    var valA = getCellValue(a, index);
    var valB = getCellValue(b, index);
    return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB);
  };
}

function getCellValue(row, index) {
  return $(row).children('td').eq(index).text();
}

// ----------------------------------------------------------------------------- 
// handling events 
// ----------------------------------------------------------------------------- 

modalEventStatusId = 'modal-message-front-event'

function execute_settingEvent(element) {

  feEvent     = $(element).attr('data-myevent');
  fePlugin    = $(element).attr('data-myparam-plugin');
  feSetKey    = $(element).attr('data-myparam-setkey');
  feParam     = $(element).attr('data-myparam');
  feSourceId  = $(element).attr('id');

  if (["test", "run"].includes(feEvent)) {
    // Calls a backend function to add a front-end event (specified by the attributes 'data-myevent' and 'data-myparam-plugin' on the passed  element) to an execution queue
    // value has to be in format event|param. e.g. run|ARPSCAN
    action = `${getGuid()}|${feEvent}|${fePlugin}`

    $.ajax({
      method: "POST",
      url: "php/server/util.php",
      data: { function: "addToExecutionQueue", action: action  },
      success: function(data, textStatus) {
          // showModalOk ('Result', data );

          // show message
          showModalOk(getString("general_event_title"), `${getString("general_event_description")}  <br/> <br/> <code id='${modalEventStatusId}'></code>`);

          updateModalState()
      }
    })
    
  } else if (["add_option"].includes(feEvent)) {
    showModalFieldInput (
      '<i class="fa fa-square-plus pointer"></i> ' + getString('Gen_Add'),
      getString('Gen_Add'),
      getString('Gen_Cancel'), 
      getString('Gen_Okay'), 
      '', // curValue
      'addOptionFromModalInput',
      feSourceId // triggered by id
    );
  } else if (["add_icon"].includes(feEvent)) {

      // Add new icon as base64 string 
    showModalInput (
      '<i class="fa fa-square-plus pointer"></i> ' + getString('DevDetail_button_AddIcon'),
      getString('DevDetail_button_AddIcon_Help'),
      getString('Gen_Cancel'), 
      getString('Gen_Okay'), 
      () => addIconAsBase64(element), // Wrap in an arrow function
      feSourceId // triggered by id
    );
  } else if (["copy_icons"].includes(feEvent)) {


    // Ask overwrite icon types 
    showModalWarning (
      getString('DevDetail_button_OverwriteIcons'), 
      getString('DevDetail_button_OverwriteIcons_Warning'),
      getString('Gen_Cancel'), 
      getString('Gen_Okay'), 
      'overwriteIconType'
    );
  } else if (["go_to_node"].includes(feEvent)) {

    goToNetworkNode('NEWDEV_devParentMAC');

  } else {
    console.warn(`🔺Not implemented: ${feEvent}`)
  }
  
  
}


// -----------------------------------------------------------------------------
// Go to the correct network node in the Network section
function goToNetworkNode(dropdownId)
{  
  setCache('activeNetworkTab', $('#'+dropdownId).val().replaceAll(":","_")+'_id');
  window.location.href = './network.php';
  
}
  

// --------------------------------------------------------
// Updating the execution queue in in modal pop-up
function updateModalState() {
  setTimeout(function() {
      // Fetch the content from the log file using an AJAX request
      $.ajax({
          url: '/php/server/query_logs.php?file=execution_queue.log',
          type: 'GET',
          success: function(data) {
              // Update the content of the HTML element (e.g., a div with id 'logContent')
              $('#'+modalEventStatusId).html(data);

              updateModalState();
          },
          error: function() {
              // Handle error, such as the file not being found
              $('#logContent').html('Error: Log file not found.');
          }
      });
  }, 2000);
}

// --------------------------------------------------------
// A method to add option to select and make it selected
function addOptionFromModalInput() {
  var inputVal = $(`#modal-field-input-field`).val();
  console.log($('#modal-field-input-field'));
  
  var triggeredBy = $('#modal-field-input').attr("data-myparam-triggered-by");
  var targetId = $('#' + triggeredBy).attr("data-myparam-setkey");

  // Add new option and set it as selected
  $('#' + targetId).append(new Option(inputVal, inputVal)).val(inputVal);
}


// --------------------------------------------------------
// Generate a random MAC address starting 00:1A
function generate_NEWDEV_devMac() {
  const randomHexPair = () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0').toUpperCase();
  $('#NEWDEV_devMac').val(`00:1A:${randomHexPair()}:${randomHexPair()}:${randomHexPair()}:${randomHexPair()}`.toLowerCase());
}


// --------------------------------------------------------
// Generate a random IP address starting 192.
function generate_NEWDEV_devLastIP() {
  const randomByte = () => Math.floor(Math.random() * 256);
  $('#NEWDEV_devLastIP').val(`192.${randomByte()}.${randomByte()}.${Math.floor(Math.random() * 254) + 1}`);
}

// -----------------------------------------------------------------------------
// A method to add an Icon as an option to select and make it selected
function addIconAsBase64 (el) {

  var iconHtml = $('#modal-input-textarea').val();

  console.log(iconHtml);

  iconHtmlBase64 = btoa(iconHtml.replace(/"/g, "'"));

  console.log(iconHtmlBase64);


  console.log($('#modal-field-input-field'));
  
  var triggeredBy = $('#modal-input').attr("data-myparam-triggered-by");
  var targetId = $('#' + triggeredBy).attr("data-myparam-setkey");

  // $('#'+targetId).val(iconHtmlBase64); 

  // Add new option and set it as selected
  $('#' + targetId).append(new Option(iconHtmlBase64, iconHtmlBase64)).val(iconHtmlBase64);

  updateIconPreview(el)  

}



function showIconSelection() {
  const selectElement = document.getElementById('NEWDEV_devIcon');
  const modalId = 'dynamicIconModal';

  // Create modal HTML dynamically
  const modalHTML = `
    <div id="${modalId}" class="modal fade" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">${getString("Gen_Select")}</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="iconList" class="row"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the modal to the body
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const iconList = document.getElementById('iconList');

  // Populate the icon list
  Array.from(selectElement.options).forEach(option => {
    if (option.value != "") {
        
      
      const value = option.value;

      // Decode the base64 value
      let decodedValue;
      try {
        decodedValue = atob(value);
      } catch (e) {
        console.warn(`Skipping invalid base64 value: ${value}`);
        return;
      }

      // Create an icon container
      const iconDiv = document.createElement('div');
      iconDiv.classList.add('iconPreviewSelector','col-md-2' , 'col-sm-3', 'col-xs-4');
      iconDiv.style.cursor = 'pointer';

      // Render the SVG or HTML content
      const iconContainer = document.createElement('div');
      iconContainer.innerHTML = decodedValue;

      // Append the icon to the div
      iconDiv.appendChild(iconContainer);
      iconList.appendChild(iconDiv);

      // Add click event to select icon
      iconDiv.addEventListener('click', () => {
        selectElement.value = value; // Update the select element value
        $(`#${modalId}`).modal('hide'); // Hide the modal
        updateIconPreview();
      });
    }
  });

  // Show the modal using AJAX
  $(`#${modalId}`).modal('show');

  // Remove modal from DOM after it's hidden
  $(`#${modalId}`).on('hidden.bs.modal', function () {
    document.getElementById(modalId).remove();
  });

  //
  
}





// -----------------------------------------------------------------------------
// initialize
// -----------------------------------------------------------------------------

function initSelect2() {

  // Retrieve device list from session variable
  var devicesListAll_JSON = getCache('devicesListAll_JSON');

  //  check if cache ready
  if(isValidJSON(devicesListAll_JSON))
  {
    // prepare HTML DOM before initializing the frotend
    initDeviceSelectors(devicesListAll_JSON)

    
    // --------------------------------------------------------
    //Initialize Select2 Elements and make them sortable
    
    $(function () {
      // Iterate over each Select2 dropdown
      $('.select2').each(function() {
          var selectEl = $(this).select2();
    
          // Apply sortable functionality to the dropdown's dropdown-container
          selectEl.next().children().children().children().sortable({
              containment: 'parent',
              update: function () {
                  var sortedValues = $(this).children().map(function() {
                      return $(this).attr('title');
                  }).get();
    
                  var sortedOptions = selectEl.find('option').sort(function(a, b) {
                      return sortedValues.indexOf($(a).text()) - sortedValues.indexOf($(b).text());
                  });
    
                  // Replace all options in selectEl
                  selectEl.empty().append(sortedOptions);
    
                  // Trigger change event on Select2
                  selectEl.trigger('change');
              }
          });
      });
    });
  } else // cache not ready try later
  {
    setTimeout(() => {
      initSelect2()
    }, 1000);
  }  
}

// init functions after dom loaded
window.addEventListener("load", function() {
  // try to initialize 
  setTimeout(() => {
    initSelect2()
    initializeiCheck();
  }, 1000);
});


console.log("init ui_components.js")