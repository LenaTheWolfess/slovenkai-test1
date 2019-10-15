function Connector(id, key)
{
    this.id = id;
    this.key = key;
    this.url = '';
}

Connector.prototype.SetUrl = function(url)
{
    this.url = url;
}

Connector.prototype.CreateRequest = function(method, addUrl = '', reqType = '')
{
    let request = new XMLHttpRequest();
    request.open(method, this.url + addUrl, true);
    if (reqType)
        request.responseType = reqType;
    request.setRequestHeader("X-Parse-Application-Id", this.id);
    request.setRequestHeader("X-Parse-REST-API-Key", this.key);
    return request;
}

Connector.prototype.GetData = function(callback)
{
    let request = this.CreateRequest('GET');
    request.onload = () => {
        let status = request.status;
        if (status != 200) {
            this.HandleError(status, request.response);
            return;
        }
        callback(request.response);
    };
    request.send();
}

Connector.prototype.GetOneObject = function(id, callback)
{
    let request = this.CreateRequest('GET', id);
    request.onload = () => {
        let status = request.status;
        if (status != 200) {
            this.HandleError(status, request.response);
            return;
        }
        callback(request.response);
    };
    request.send();
}

Connector.prototype.AddData = function(data, callback)
{
    let request = this.CreateRequest('POST');
    request.onload = () => {
        let status = request.status;
        if (status != 201) {
            this.HandleError(status, request.response);
            return;
        }
        callback && callback(request.response);
    };
    request.send(JSON.stringify(data));
}

Connector.prototype.UpdateData = function(id, data)
{
    let request = this.CreateRequest('PUT', id, 'json');
    request.onload = () => {
        let status = request.status;
        if (status != 200) {
            this.HandleError(status, request.response);
            return;
        }
    };
    request.send(JSON.stringify(data));
}

Connector.prototype.RemoveData = function(id)
{
    let request = this.CreateRequest('DELETE', id);
    request.onload = () => {
        let status = request.status;
        if (status != 200) {
            this.HandleError(status, request.response);
            return;
        }
    };
    request.send();
}

Connector.prototype.HandleError = function(code, msg)
{
    console.error(code + ": " + msg);
}