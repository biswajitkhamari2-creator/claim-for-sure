<?php
declare(strict_types=1);
final class Validator
{
    private array $errors = [];
    public function __construct(private array $data) {}
    public function required(string $f, string $l): self
    {
        if (!isset($this->data[$f]) || trim((string)$this->data[$f]) === '')
            $this->errors[$f] = "{$l} is required";
        return $this;
    }
    public function email(string $f): self
    {
        if (!empty($this->data[$f]) && !filter_var($this->data[$f], FILTER_VALIDATE_EMAIL))
            $this->errors[$f] = 'Invalid email address';
        return $this;
    }
    public function indianMobile(string $f): self
    {
        if (!empty($this->data[$f]) && !preg_match('/^[6-9]\d{9}$/', (string)$this->data[$f]))
            $this->errors[$f] = 'Enter a valid 10-digit Indian mobile number';
        return $this;
    }
    public function minLen(string $f, int $n, string $l): self
    {
        if (!empty($this->data[$f]) && mb_strlen((string)$this->data[$f]) < $n)
            $this->errors[$f] = "{$l} must be at least {$n} characters";
        return $this;
    }
    public function fails(): bool { return $this->errors !== []; }
    public function errors(): array { return $this->errors; }
}