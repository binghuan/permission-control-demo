package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"testing"
)

const serverURL = "http://localhost:8080/v1/calendar/default/events/eventId?type=difft"

func TestGetCalendarEventDetails(t *testing.T) {
	// 发起GET请求
	resp, err := http.Get(serverURL)
	if err != nil {
		t.Fatalf("Failed to make GET request: %v", err)
	}
	defer resp.Body.Close()

	// 读取响应体
	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		t.Fatalf("Failed to read response body: %v", err)
	}

	// 解析响应体
	var result map[string]interface{}
	if err := json.Unmarshal(body, &result); err != nil {
		t.Fatalf("Failed to unmarshal response: %v", err)
	}

	// 检查响应状态
	if status, ok := result["status"].(float64); !ok || status != 0 {
		t.Fatalf("Unexpected status in response: %v", result["status"])
	}

	// 检查返回的数据中是否包含"permissions"节点
	data, ok := result["data"].(map[string]interface{})
	if !ok {
		t.Fatalf("Data field missing or not a map: %v", result["data"])
	}

	if _, ok := data["permissions"]; !ok {
		t.Fatalf("Permissions field missing in data: %v", data)
	}
}
