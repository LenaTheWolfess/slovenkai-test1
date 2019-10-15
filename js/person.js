const g_connector = new Connector("3LR6Qgf0euuDfpT90VAjXnWCK3lwhfU5fNt8fbGS", "NuhivZoUWgIf4M33Zp3Iu6UVtzY6qFMXRwzNPVFm");
var idEditing = undefined;
var objectEditing = undefined;
var buttonEditing = undefined;
var formEditing = undefined;
var hidden = true;

function setupConnector()
{
    g_connector.SetUrl("https://parseapi.back4app.com/classes/Person/");
}

function getAllHandler(data)
{
    JSON.parse(data).results.forEach(t => addToHtml(t));
}

function getOneHandler(data)
{
    addToHtml(JSON.parse(data));
}

function handleInsertedData(data)
{
    let parsedData = JSON.parse(data);
    g_connector.GetOneObject(parsedData.objectId, getOneHandler);
}

function reloadData()
{
    g_connector.GetData(getAllHandler);
}

function formatDataForHtml(data)
{
    return "" + data.name + "<br>" + data.age + " years old<br>" + data.sex;
}

function updateButton(button, data)
{
    button.innerHTML = formatDataForHtml(data);
}

function addToHtml(data)
{
    let dataHolder = document.getElementById("personList");

    let divHolder = document.createElement("div");
    let child = document.createElement("button");

    child.innerHTML = formatDataForHtml(data);
    child.setAttribute("objectId", data.objectId);
    child.setAttribute("type","button");
    child.setAttribute("id", "button");
    child.classList.add("pButton");

    // Mark person to edit or delete
    child.addEventListener("click", () => {
        if (!hidden && data.objectId == idEditing) {
            hideEditing();
            return;
        }
        idEditing = data.objectId;
        let edF = document.getElementById("editPerForm");
        if (buttonEditing)
            buttonEditing.classList.remove("pButtonF");
        if (edF)
            edF.classList.remove("hideEl");
        objectEditing = divHolder;
        buttonEditing = child;
        formEditing = edF;
        child.classList.add("pButtonF");

        objectEditing.appendChild(edF);
        document.getElementById("txtEdFieldName").value = data.name;
        document.getElementById("nmbEdFieldAge").value = data.age;
        document.getElementById("txtEdFieldSex").value = data.sex;
        hidden = false;
    });

    divHolder.appendChild(child);
    dataHolder.appendChild(divHolder);
}

function clearEditFields()
{
    document.getElementById("txtEdFieldName").value = "";
    document.getElementById("nmbEdFieldAge").value = "";
    document.getElementById("txtEdFieldSex").value = "";
}

function hideEditing()
{
    if (formEditing)
        formEditing.classList.add("hideEl");
    if (buttonEditing)
        buttonEditing.classList.remove("pButtonF");
    hidden = true;
}

function addListeners()
{
    document.getElementById("showNewForm").addEventListener("click", () => {
        document.getElementById("newPerForm").classList.remove("hideEl");
        document.getElementById("showNewForm").classList.add("hideEl");
    });
    document.getElementById("btnNewPersonCancel").addEventListener("click", () => {
        document.getElementById("newPerForm").classList.add("hideEl");
    });
    document.getElementById("btnEdPersonCancel").addEventListener("click", () => {
        hideEditing();
    });
    document.getElementById("btnNewPerson").addEventListener("click", () => {
        let name = document.getElementById("txtFieldName").value.trim();
        let age = +document.getElementById("nmbFieldAge").value;
        let sex = document.getElementById("txtFieldSex").value;

        if (!name || !age || !sex)
            return;
        
        let person = {};
        person.name = name;
        person.age = age;
        person.sex = sex;
        
        g_connector.AddData(person, handleInsertedData);

         // Clear fields
         document.getElementById("txtFieldName").value = "";
         document.getElementById("nmbFieldAge").value = "";
         document.getElementById("txtFieldSex").value = "";

         // Hide form
        document.getElementById("newPerForm").classList.add("hideEl");
        document.getElementById("showNewForm").classList.remove("hideEl");
    });
    document.getElementById("btnEdPerson").addEventListener("click", () => {
        if (!idEditing || !objectEditing)
            return;

        let name = document.getElementById("txtEdFieldName").value.trim();
        let age = +document.getElementById("nmbEdFieldAge").value;
        let sex = document.getElementById("txtEdFieldSex").value;

        if (!name || !age || !sex)
            return;
        
        let person = {};
        person.name = name;
        person.age = age;
        person.sex = sex;
        
        g_connector.UpdateData(idEditing, person);
        // Clear fields
        clearEditFields();
        updateButton(buttonEditing, person);
        hideEditing();
    });
    document.getElementById("btnRePerson").addEventListener("click", () => {
        if (!idEditing || !objectEditing)
            return;

        g_connector.RemoveData(idEditing);
        let parent = document.getElementById("personList");
        let toDelete = objectEditing;
        // Clear fields
        clearEditFields();
        parent.removeChild(toDelete);

        idEditing = undefined;
        buttonEditing = undefined;
        objectEditing = undefined;
        formEditing = undefined;
    });
}
window.onload = () => {
    addListeners();
    setupConnector();
    reloadData();
}