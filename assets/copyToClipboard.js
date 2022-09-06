export const copyToClipboard = (target, text) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        function () {
            
        },
        function (err) {
            alert('Cannot copy to clipboard')
        }
      );
    } else {

    }
  } 