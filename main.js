async function loadBin() {
  resetError();
  const { value : binId } = document.querySelector('#binIdInput')
  // todo later: ask and load by bin name and not id
  try {
    const res = await network.get(binId);
    console.log(`loaded bin: ${binId}`, res)
    displayData(res)
  } catch (error) {
    displayError(error)
    console.error(`error reading bin:`, error || "");
  }
  resetInput();
}

async function newBin() {
  resetError();
  // todo later: confirm() wether to delete unsaved work
  const { value : inputData  } = document.querySelector('#json-data');
  const { value : binName } = document.querySelector('#binNameInput');
  try {
    if(binName === "" )  {
      throw new Error('must fill In new bin Name')
    }else{
    const res = await network.post(binName, inputData);
    console.log(`Created bin ${binName} with data`, res);
    displayData(res)
  }
  } catch (error) {
    displayError(error)
    console.error("error creating bin: ", error);
  }

}

async function saveBin() {
  resetError();
  const { innerText : binId } = document.getElementById("metadata");
  const { value : binData } = document.querySelector("#view > textarea"); // exercise: use "object destructuring with alias"
  try {
    const res = await update(binId, binData);
    console.log(`Updated bin ${binId} with data`, res); // fix: display to the user the content of the json and metadata
    displayData(res);
  } catch (error) {
    displayError(error)
    console.error("error creating bin: ", error);
  }
  resetInput();
}

async function deleteBin() {
  resetError();
  const { value : binId } = document.getElementById("binIdInput");
  try {
    const res = await network.delete(binId);
    console.log(`Deleted bin ${binId} with data`, res);
    displayData( res, true );
  } catch (error) {
    displayError(error)
    console.error("error deleting bin: ", error);
  }
  resetInput();
}


// DOM handling helpers

function displayError (error) {
  //display the error at the error element
  document.querySelector("#error").hidden = false;
  document.querySelector("#error").innerText = error;
}

function displayData (res, deleteFlag) {
  const metaData = JSON.stringify(res.metadata);
  const textAreaDisplay = deleteFlag? "deleted bin with id: " + JSON.stringify(res.metadata.id):JSON.stringify(res.record)
  document.querySelector("#view > textarea").value = textAreaDisplay;
  document.querySelector("#metadata").innerText = "MetaData: " + metaData;
}

function resetInput(){
  document.querySelector('#binIdInput').value = ""
}

function resetError(){
  document.querySelector("#error").hidden = true;
}