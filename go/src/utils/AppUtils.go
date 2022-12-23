package utils

import (
	"fmt"
	"golang.org/x/text/runes"
	"golang.org/x/text/transform"
	"golang.org/x/text/unicode/norm"
	"io"
	"io/ioutil"
	"mime/multipart"
	"net/http"
	"strings"
	"unicode"
)


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


func WriteLogNNL(data ...interface{}) {
	fmt.Print(data)
}

func WriteLog(data ...interface{}) {
	fmt.Println(data)
}

func isMn(r rune) bool {
	return unicode.Is(unicode.Mn, r) // Mn: nonspacing marks
}

func ConvertToUrl(data string) string {

	t := transform.Chain(norm.NFD, transform.RemoveFunc(isMn), norm.NFC)
	result, _, _ := transform.String(t, data)
	data = strings.ReplaceAll(result, "đ", "d")
	data = strings.ReplaceAll(data, "/", "-")
	data = strings.TrimSpace(data)
	data = strings.ReplaceAll(data, " ", "-")
	data = strings.ToLower(data)

	return data
}

func BuildPath(protocol string, rootUrl string, port string, path string, queries map[string]string) string {
	url := protocol + "://" + rootUrl + ":" + port + "/" + path

	if queries != nil {
		url += "?"
		for key, val := range queries {
			url += key + "=" + val + "&"
		}
		url = strings.TrimSuffix(url, "&")
	}

	WriteLog("url: ", url)
	return url
}

func NormalizeStr(data string) string {
	t := transform.Chain(norm.NFD, runes.Remove(runes.In(unicode.Mn)), norm.NFC)
	result, _, _ := transform.String(t, data)
	result = strings.TrimSpace(result)
	result = strings.ToLower(result)
	result = strings.ReplaceAll(result, "/", "-")
	result = strings.ReplaceAll(result, " ", "-")
	result = strings.ReplaceAll(result, "đ", "d")

	return result
}

func MakeRequest(client *http.Client, endpoint string, method string, headers map[string]string, body io.Reader) string {
	request, err := http.NewRequest(method, endpoint, body)
	if err != nil {
		WriteLog("Error Occured. %+v", err)
		return ""
	}

	//Add http headers
	if headers != nil {
		for key, val := range headers {
			request.Header.Set(key, val)
		}
	}
	request.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	request.Header.Set("User-Agent", "Golang_Spider_Bot/3.0")

	response, err := client.Do(request)
	if err != nil {
		WriteLog("Error sending request to API endpoint. %+v", err)
		return ""
	}

	// Close the connection to reuse it
	defer response.Body.Close()

	respBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		WriteLog("Couldn't parse response body. %+v", err)
		return ""
	}

	//WriteLog(string(respBody))

	return string(respBody)
}

func MakeRequest2(client *http.Client, endpoint string, method string, headers map[string]string, body io.Reader, writer *multipart.Writer) string {
	request, err := http.NewRequest(method, endpoint, body)

	if err != nil {
		WriteLog("Error Occured. %+v", err)
	}

	//Add http headers
	if headers != nil {
		for key, val := range headers {
			request.Header.Set(key, val)
		}
	}
	request.Header.Set("Content-Type", writer.FormDataContentType())

	response, err := client.Do(request)
	if err != nil {
		WriteLog("Error sending request to API endpoint. %+v", err)
	}

	// Close the connection to reuse it
	defer response.Body.Close()

	respBody, err := ioutil.ReadAll(response.Body)
	if err != nil {
		WriteLog("Couldn't parse response body. %+v", err)
	}

	return string(respBody)
}
