import { Spin } from "antd";

export function SpinnerPage() {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
            <Spin size="large" />
        </div>
    );
}
