<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $broadcast->subject }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }
        .header {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .message-content {
            font-size: 14px;
            line-height: 1.6;
        }
        .message-content ul {
            list-style-type: disc;
            margin-left: 24px;
            padding-left: 0;
        }
        .message-content ol {
            list-style-type: decimal;
            margin-left: 24px;
            padding-left: 0;
        }
        .message-content li {
            margin: 4px 0;
        }
        .message-content u {
            text-decoration: underline;
        }
        .message-content s, .message-content strike, .message-content del {
            text-decoration: line-through;
        }
        .message-content strong, .message-content b {
            font-weight: bold;
        }
        .message-content em, .message-content i {
            font-style: italic;
        }
        .message-content blockquote {
            border-left: 4px solid #ddd;
            margin: 10px 0;
            padding: 8px 16px;
            color: #555;
        }
        .message-content a {
            color: #1a73e8;
            text-decoration: underline;
        }
        .message-content p {
            margin: 8px 0;
        }
        .message-content h1, .message-content h2, .message-content h3 {
            font-weight: bold;
            margin: 12px 0 6px;
        }
        .message-content h1 { font-size: 22px; }
        .message-content h2 { font-size: 18px; }
        .message-content h3 { font-size: 16px; }
        .footer {
            margin-top: 30px;
            font-size: 12px;
            color: #777;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>{{ $broadcast->subject }}</h2>
        </div>

        <div class="message-content">
            {!! $broadcast->message !!}
        </div>

        <div class="footer">
            <p>{{ __('This email was sent by') }} <strong>{{ config('app.name') }}</strong></p>
        </div>
    </div>
</body>
</html>
